import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Platform, Alert, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';
import { useSelector, useDispatch } from 'react-redux'
import * as Calendar from 'expo-calendar'
import moment from 'moment'

import RootView from '../components/common/RootView';
import NoContentView from '../components/common/NoContentView';
import EventListView from '../components/EventListView';
import { ContentText, HeadingText } from '../components/common/Text';
import IconButton from '../components/common/IconButton';
import View from '../components/common/View'

import { fetchEvents } from '../store/actions/events';
import Keys from '../constants/Keys';
import Strings from '../constants/Strings';
import { darkTheme, lightTheme } from '../constants/Colors';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import Layout from '../constants/Layout';
import { CONTACTSCREEN } from '../constants/Paths';

const name_default_calendar = 'smartfarmcheck_event_calendar'

const EventScreen = (props) => {
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

  const [calendarOptions, setCalendarOptions] = useState([])
  const [selectedCalendarOption, setSelectedCalendarOption] = useState('')
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedCalendarOptionId, setSelectedCalendarOptionId] = useState()

  const [isLoading, setIsLoading] = useState(false)
  const [hasNoNetwork, setHasNoNetwork] = useState(false)
  const [errorCode, setErrorCode] = useState(0)

  const dispatch = useDispatch()
  const events = useSelector(state => state.events.comming)

  useEffect(() => {
    checkAndLoadEvents()
  }, [checkAndLoadEvents])

  const checkAndLoadEvents = useCallback(async () => {
    const netinfo = await NetInfo.fetch()
    if (netinfo.isConnected) {
      setIsLoading(true)
      try {
        await dispatch(fetchEvents())
      } catch (err) {
        setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
      }
      setIsLoading(false)
      setHasNoNetwork(false)
    } else {
      setHasNoNetwork(true)
    }
  }, [dispatch])

  function retryHandler() {
    setErrorCode(0)
    setHasNoNetwork(false)
    checkAndLoadEvents()
  }

  let contentView = null;
  let calendarOptionsContent = calendarOptions.map((opt, index) => {
    return <Picker.Item value={opt} key={index} label={opt.name} />
  });

  if (errorCode !== 0) {
    contentView = <NoContentView
      icon="emoticon-sad-outline"
      style={styles.noContent}
      onRetry={retryHandler}
      title={Strings.event_loading_error + "(Fehlercode: " + errorCode + ")"} />
  } else if (isLoading) {
    contentView = <NoContentView
      icon="cloud-download"
      loading
      style={styles.noContent}
      title={Strings.event_loading} />
  } else if (hasNoNetwork && events.length === 0) {
    contentView = <NoContentView
      icon="cloud-off-outline"
      style={styles.noContent}
      title={Strings.event_loading_no_network}
      onRetry={retryHandler} />
  } else if (events.length === 0) {
    contentView = (
      <ScrollView style={styles.scroll}>
        <HeadingText large weight="bold" style={styles.heading}>{Strings.event_list_heading}</HeadingText>
        <View component style={styles.nothingFittingEvent}>
          <HeadingText weight="bold">{Strings.event_no_upcomming_title}</HeadingText>
          <ContentText style={styles.nothingFittingButton}>{Strings.event_no_upcomming_alternatives}</ContentText>
          <View style={styles.buttonRow}>
            <View style={styles.leftModalButton}>
              <IconButton
                text={Strings.event_nothing_fitting_goto_website}
                icon="web"
                onPress={() => { props.navigation.navigate(CONTACTSCREEN) }} />
            </View>
            <View style={styles.rightModalButton} >
              <IconButton
                text={Strings.event_nothing_fitting_goto_contact}
                icon="card-account-mail-outline"
                onPress={() => { props.navigation.navigate(CONTACTSCREEN) }} />
            </View>
          </View>
        </View>
      </ScrollView>
    )
  } else {
    const nothingFittingFoundContent =
      <View component style={styles.nothingFittingEvent}>
        <HeadingText weight="bold">{Strings.event_nothing_fitting_title}</HeadingText>
        <ContentText style={styles.nothingFittingButton}>{Strings.event_nothing_fitting_content}</ContentText>
        <IconButton
          text={Strings.event_nothing_fitting_goto_contact}
          icon="card-account-mail-outline"
          onPress={() => { props.navigation.navigate(CONTACTSCREEN) }} />
      </View>

    contentView = (
      <>
        <Modal transparent visible={showCalendarModal}>
          <View style={{ ...styles.modalView, backgroundColor: colorTheme.componentBackground }}>
            <HeadingText weight="bold">{Strings.calendar_select_default}</HeadingText>
            <Picker selectedValue={selectedCalendarOption} onValueChange={calendarOptionChangeHandler}>
              {calendarOptionsContent}
            </Picker>
            <View style={styles.calendarModalButtonRow}>
              <View style={styles.leftModalButton} >
                <IconButton
                  success
                  icon="check"
                  text={Strings.save}
                  onPress={saveDefaultCalendarHandler} />
              </View>
              <View style={styles.rightModalButton} >
                <IconButton
                  error
                  icon="close"
                  text={Strings.cancel}
                  onPress={() => setShowCalendarModal(false)} />
              </View>
            </View>
          </View>
        </Modal>
        <EventListView
          style={styles.eventList}
          listHeaderComponent={<HeadingText large weight="bold" style={styles.heading}>{Strings.event_list_heading}</HeadingText>}
          listFooterComponent={nothingFittingFoundContent}
          events={events}
          onExportToCalendarPress={(e) => exportToCalendarWithPermissionInformationHandler(e)} />
      </>)

  }
  return (
    <RootView>
      {contentView}
    </RootView>
  );

  function calendarOptionChangeHandler(value, index) {
    console.log("Calendaroption: ", value, index)
    setSelectedCalendarOption(value)
    if (index >= 0 && index < calendarOptions.length) {
      setSelectedCalendarOptionId(calendarOptions[index].id)
    } else {
      setSelectedCalendarOptionId(undefined)
    }
  }

  async function saveDefaultCalendarHandler() {
    if (selectedCalendarOptionId === "sfc_calendar_new") {
      try {
        console.log("Creating new calendar...")
        const id = await createLocalCalendarAsync()
        console.log("EVENTSCREEN", "Created new calendar with id", id)
        await saveDefaultCalendarAsync(id)
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Use choise was: " + selectedCalendarOptionId)
      await saveDefaultCalendarAsync(selectedCalendarOptionId)
    }
    setShowCalendarModal(false)
  }

  async function saveDefaultCalendarAsync(id) {
    return AsyncStorage.setItem(Keys.DEFAULT_CALENDAR_ID, id)
  }

  async function exportToCalendarWithPermissionInformationHandler(event) {
    var status = 'denied'
    var canAskAgain = true
    if (Platform.OS === "android") {
      var android = await Calendar.getCalendarPermissionsAsync();
      status = android.status
      canAskAgain = android.canAskAgain
    } else if (Platform.OS === "ios") {
      const iosCal = await Calendar.getCalendarPermissionsAsync();
      const iosRem = await Calendar.getRemindersPermissionsAsync();

      status = iosCal.status === 'granted' && iosCal.status === 'granted' ? 'granted' : 'denied'
      canAskAgain = iosCal.canAskAgain || iosRem.canAskAgain
    }

    if (status !== 'granted' && canAskAgain) {
      Alert.alert(
        Strings.permission_calendar,
        Strings.permission_calendar_information_before,
        [
          {
            text: Strings.okay,
            onPress: () => exportToCalendarHandler(event),
            style: "default"
          },
        ],
        { cancelable: false }
      );
    } else if (status !== 'granted' && !canAskAgain) {
      Alert.alert(
        Strings.permission_calendar_denied,
        Strings.permission_calendar_information_before_denied_permanent,
        [
          {
            text: Strings.okay,
            style: "default"
          },
        ],
        { cancelable: true }
      );
    } else {
      return exportToCalendarHandler(event)
    }
  }

  async function showFailedPermissionInformation() {
    const { status, canAskAgain } = await Calendar.getCalendarPermissionsAsync();

    if (status === 'denied' && canAskAgain) {
      Alert.alert(
        Strings.permission_calendar_denied,
        Strings.permission_calendar_information_after_denied,
        [
          {
            text: Strings.okay,
            style: "true"
          },
        ],
        { cancelable: true }
      );
    } else if (status === 'denied' && !canAskAgain) {
      Alert.alert(
        Strings.permission_calendar_denied,
        Strings.permission_calendar_information_after_denied_permanent,
        [
          {
            text: Strings.okay,
            style: "default"
          },
        ],
        { cancelable: true }
      );
    }
  }

  async function getPresistedCalendarIdAsync() {
    return AsyncStorage.getItem(Keys.DEFAULT_CALENDAR_ID)
  }

  async function exportEventAsync(calendarId, event) {
    const details = {
      title: event.title,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }

    await AsyncStorage.setItem(Keys.DEFAULT_CALENDAR_ID, calendarId)

    var events = await Calendar.getEventsAsync([calendarId], details.startDate, details.endDate)
    const existing = events.find(e => compare(e, event))
    if (existing) {
      console.log(event)
      Alert.alert(
        Strings.event_already_in_calendar_title,
        Strings.event_already_in_calendar_text,
        [
          {
            text: Strings.okay,
            style: "default"
          }
        ],
        { cancelable: true }
      );
    } else {
      return Calendar.createEventAsync(calendarId, details).catch(error => console.log("Error", error))
    }
  }

  function compare(e1, e2) {
    console.log("Start: ", e1.startDate, e2.startDate)
    console.log("Ende: ", e1.endDate, e2.endDate)

    return e1.title === e2.title && moment(e1.startDate).isSame(e2.startDate, 'minute') && moment(e1.endDate).isSame(e2.endDate, 'minute')
  }

  async function exportToCalendarHandler(event) {
    var { status } = await Calendar.requestCalendarPermissionsAsync();

    if (Platform.OS === 'ios') {
      const iosRem = await Calendar.requestRemindersPermissionsAsync();
      if (iosRem.status !== 'granted') {
        return showFailedPermissionInformation();
      }
    }

    if (status === 'granted') {
      const storedCalendarId = await getPresistedCalendarIdAsync();
      if (storedCalendarId) {
        return exportEventAsync(storedCalendarId, event)
      }
      else {
        return exportToNewCalendarAsync(event);
      }
    } else {
      return showFailedPermissionInformation();
    }
  };

  async function exportToNewCalendarAsync(event) {
    const calendars = await Calendar.getCalendarsAsync();
    console.log("Found " + calendars.length + " Calendars")
    var calendar = await getDefaultCalendarAsync(calendars);

    if (!calendar) {
      console.log("Found no default calendar. Asking...")
      askForDefaultCalendarAsync(calendars)
    } else {
      return exportEventAsync(calendar.id, event)
    }
  }

  async function getDefaultCalendarAsync(calendars) {
    if (Platform.OS === 'ios') {
      return Calendar.getDefaultCalendarAsync()
    } else {
      const calendar = calendars.find(({ isPrimary }) => isPrimary);
      return Promise.resolve(calendar)
    }
  }

  function askForDefaultCalendarAsync(calendars) {
    var list = []
    calendars.forEach(c => {
      if (c.allowsModifications) list.push({ id: c.id, name: c.title })
    });
    list.push({ id: 'sfc_calendar_new', name: Strings.calendar_create_new })
    setCalendarOptions(list)
    calendarOptionChangeHandler(list[0], 0)
    setShowCalendarModal(true)
  }

  async function getDefaultCalendarSource() {
    if (Platform === 'ios') {
      const calendars = await Calendar.getCalendarsAsync();
      const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
      return defaultCalendars[0].source;
    } else {
      return { isLocalAccount: true, name: Strings.app_title }
    }
  }

  async function createLocalCalendarAsync() {
    const defaultCalendarSource = await getDefaultCalendarSource()
    return Calendar.createCalendarAsync({
      title: Strings.event_calendar,
      color: colorTheme.primary,
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: name_default_calendar,
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
  }
}

const styles = StyleSheet.create({
  nothingFittingEvent: {
    padding: 8,
    marginHorizontal: 4,
    marginVertical: 8,
    borderColor: Layout.borderColor,
    borderWidth: Layout.borderWidth,
    borderRadius: Layout.borderRadius
  },
  nothingFittingButton: {
    marginVertical: 8
  },
  heading: {
    marginTop: 8,
    marginHorizontal: 8
  },
  modalView: {
    margin: 24,
    padding: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  calendarModalButtonRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  leftModalButton: {
    flex: 1,
    marginEnd: 4
  },
  rightModalButton: {
    flex: 1,
    marginStart: 4
  },
  eventList: {
    marginHorizontal: 4
  },
  noContent: {
    margin: 8
  },
  buttonRow: {
    flexDirection: 'row'
  },
  scroll: {
    marginHorizontal: 4
  }
});

export default EventScreen
