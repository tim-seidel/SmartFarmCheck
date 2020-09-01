import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Linking, Platform, Alert, AsyncStorage, Modal, Picker } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import * as Calendar from 'expo-calendar'
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo';

import NoContentView from '../components/NoContentView';
import EventListItemView from '../components/EventViewListItemView';
import InformationCard, { InformationText } from '../components/InformationCard';
import { HeadingText } from '../components/Text';
import Strings from '../constants/Strings';
import IconButton from '../components/IconButton';
import { useThemeProvider } from '../ThemeContext';
import Keys from '../constants/Keys';
import RootView from '../components/RootView';
import { fetchEvents } from '../store/actions/events';

const name_default_calendar = 'smartfarmcheck_event_calendar'

const EventScreen = (props) => {
  const { colorTheme } = useThemeProvider()

  const [isLoading, setIsLoading] = useState(false)
  const [hasNoNetwork, setHasNoNetwork] = useState(false)
  const [errorCode, setErrorCode] = useState(0)

  const [calendarOptions, setCalendarOptions] = useState([])
  const [selectedCalendarOption, setSelectedCalendarOption] = useState('')
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedCalendarOptionId, setSelectedCalendarOptionId] = useState()

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
        console.log(err)
        setErrorCode(err.status ?? -1)
      }
      setIsLoading(false)
    } else {
      setHasNoNetwork(true)
    }
  }, [dispatch])

  function retryHandler() {
    setErrorCode(0)
    setHasNoNetwork(false)
    checkAndLoadEvents()
  }

  function showDetailHandler(event) {
    Linking.openURL(event.url)
  }

  function showRegisterHandler(event) {
    Linking.openURL(event.url)
  }

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
      console.log("Creating new calendar...")
      const id = await createLocalCalendarAsync()
      await saveDefaultCalendarAsync(id)
    } else {
      console.log("Use choise was: " + selectedCalendarOptionId)
      await saveDefaultCalendarAsync(selectedCalendarOptionId)
    }
    setShowCalendarModal(false)
  }

  async function saveDefaultCalendarAsync(id) {
    return AsyncStorage.setItem(Keys.DEFAULT_CALENDAR_ID, id)
  }

  let contentView = null;
  let calendarOptionsContent = calendarOptions.map((opt, index) => {
    return <Picker.Item value={opt} key={index} label={opt.name}></Picker.Item>
  });

  if (errorCode !== 0) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.event_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView>
  } else if (isLoading) {
    contentView = <NoContentView icon="cloud-download" loading title={Strings.event_loading}></NoContentView>
  } else if (hasNoNetwork && events.length === 0) {
    contentView = <NoContentView icon="cloud-off-outline" title={Strings.event_loading_no_network} onRetry={retryHandler}></NoContentView>
  } else if (!events || events.length === 0) {
    contentView = <NoContentView icon="calendar-remove" retryTitle={Strings.refresh} onRetry={retryHandler} title={Strings.event_loading_empty}></NoContentView>
  } else {
    contentView = (
      <>
        <Modal transparent visible={showCalendarModal}>
          <View style={{ ...styles.modalView, backgroundColor: colorTheme.background }}>
            <HeadingText>Standardkalender auswählen</HeadingText>
            <Picker selectedValue={selectedCalendarOption} onValueChange={calendarOptionChangeHandler}>
              {calendarOptionsContent}
            </Picker>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <View style={{ flex: 1, marginEnd: 2 }} >
                <IconButton icon="check" text="Speichern" onPress={saveDefaultCalendarHandler}></IconButton>
              </View>
              <View style={{ flex: 1, marginStart: 2 }} >
                <IconButton icon="close" text="Abbrechen" onPress={() => setShowCalendarModal(false)}></IconButton>
              </View>
            </View>
          </View>
        </Modal>
        <FlatList
          data={events}
          ListHeaderComponent={
            <View>
              <InformationCard title={Strings.main_greeting_title} style={styles.welcomeCard}>
                <InformationText>{Strings.main_greeting_content}</InformationText>
              </InformationCard>
              <HeadingText large weight="bold" style={styles.heading}>Kommende Veranstaltungen:</HeadingText>
            </View>}
          renderItem={({ item }) => (
            <EventListItemView
              event={item}
              onDetailPress={() => showDetailHandler(item)}
              onRegisterPress={() => showRegisterHandler(item)}
              onExportToCalendarPress={() => exportToCalendarWithPermissionInformationHandler(item)}
            />
          )}
          keyExtractor={item => item.id}
        />
      </>)
  }

  return (
    <RootView style={styles.container}>
      {contentView}
    </RootView>
  );

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
    list.push({ id: 'sfc_calendar_new', name: '[Neuen Kalender erstellen]' })
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
  container: {
    flex: 1,
    paddingStart: 8,
    paddingEnd: 8
  },
  heading: {
    marginTop: 16,
    marginBottom: 8,
    marginStart: 2
  },
  modalView: {
    margin: 24,
    padding: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 5
  },
  welcomeCard: {
    marginTop: 8
  }
});

export default EventScreen
