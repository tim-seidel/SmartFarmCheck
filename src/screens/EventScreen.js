import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Linking, Platform, Alert, AsyncStorage, Modal, Picker } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import * as Calendar from 'expo-calendar'
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo';

import NoContentView from '../components/NoContentView';
import EventListItemView from '../components/EventViewListItem';
import InformationCard, { InformationText } from '../components/InformationCard';
import { HeadingText } from '../components/Text';
import events from '../model/Events';
import Strings from '../constants/Strings';
import IconButton from '../components/IconButton';
import { useStateValue } from '../StateProvider';

const key_default_calendar_id = 'sfc_default_calendar_id'
const name_default_calendar = 'smartfarmcheck_event_calendar'

const eventMock = events
const EventScreen = (props) => {
  const [{ colorTheme }, dispatch] = useStateValue()

  const [eventState, setEventState] = useState({ isLoaded: false, error: null, errorCode: 0, events: [] })
  const [calendarOptions, setCalendarOptions] = useState([])
  const [selectedCalendarOption, setSelectedCalendarOption] = useState('')
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedCalendarOptionId, setSelectedCalendarOptionId] = useState()

  useEffect(() => {
    if (!eventState.isLoaded) {
      checkAndLoadEvents();
    }
  }, [eventState.isLoaded])

  function checkAndLoadEvents() {
    if (!eventState.isLoaded) {

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
              loadEvents()
            } else {
                setEventState({ isLoaded: true, error: null, errorCode: 0, hasNetwork: false, events: [] })
            }
        });
    }
}

  function loadEvents() {
      /*
      fetch('https://pas.coala.digital/v1/events', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      })
        .then(response => response.json())
        .then(json => {
          //Check for request errors
          if (json.status && json.status != 200) {
            setEventState({ isLoaded: true, hasNetowrk: true, error: json, errorCode: json.status ?? -1, events: [] })
          } else {
            //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
            setEventState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, events: json })
          }
        })
        .catch(error => {
          console.log("Error", error)
          setEventState({ isLoaded: true, hasNetwork: true, error: error, errorCode: -1, events: [] })
        })
        */
      setEventState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, events: eventMock })
  }

  function retryHandler() {
    setEventState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, events: [] })
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
    return AsyncStorage.setItem(key_default_calendar_id, id)
  }

  const { isLoaded, hasNetwork, error, errorCode, events } = eventState;

  let eventContent = null;
  let calendarOptionsContent = calendarOptions.map((opt, index) => {
    return <Picker.Item value={opt} key={index} label={opt.name}></Picker.Item>
  });

  function darkModelHandler() {
    dispatch({
      type: 'changeTheme'
    })
  }

  if (error) {
    eventContent = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.event_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView>
  } else if (!isLoaded) {
    eventContent = <NoContentView icon="cloud-download" loading title={Strings.event_loading}></NoContentView>
  } else if (!hasNetwork) {
    eventContent = <NoContentView icon="cloud-off-outline" loading title={Strings.event_loading_no_network}></NoContentView>
  } else if (!events || events.length === 0) {
    eventContent = <NoContentView icon="calendar-remove" retryTitle={Strings.refresh} onRetry={retryHandler} title={Strings.event_loading_empty}></NoContentView>
  } else {
    eventContent = (
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
    <View style={{ ...styles.container, backgroundColor: colorTheme.background }} >
      {eventContent}
    </View>
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
    return AsyncStorage.getItem(key_default_calendar_id)
  }

  async function exportEventAsync(calendarId, event) {
    const details = {
      title: event.title,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }

    await AsyncStorage.setItem(key_default_calendar_id, calendarId)

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
    paddingHorizontal: 8
  },
  heading: {
    marginTop: 16,
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

export default EventScreen;