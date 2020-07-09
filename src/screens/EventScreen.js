import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import NoContentView from '../components/NoContentView';
import EventListItemView from '../components/EventViewListItem';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import { HeadingText } from '../components/Text';

const eventMock = [
  {
    id: "1",
    date: "01.04.2020",
    title: "KI-Einführung",
    short: "Ein Workshop, der eine Einführung in das KI-Thema bietet."
  },
  {
    id: "2",
    date: "01.04.2020",
    title: "KI-Workshop",
    short: "Ein Workshop, der eine Einführung in das KI-Thema bietet."
  },
  {
    id: "3",
    date: "01.04.2020",
    title: "App-Workshop",
    short: "Ein Workshop, der eine Einführung in das KI-Thema bietet."
  }
]

const EventScreen = (props) => {

  const [eventState, setEventState] = useState({ isLoaded: false, error: null, errorCode: 0, events: [] })

  useEffect(() => {
    if (!eventState.isLoaded) {
      loadEvents();
    }
  }, [eventState.isLoaded])

  function loadEvents() {
    if (!eventState.isLoaded) {
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
            setEventState({ isLoaded: true, error: json, errorCode: json.status ?? -1, events: [] })
          } else {
            //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
            setEventState({ isLoaded: true, error: null, errorCode: 0, events: json })
          }
        })
        .catch(error => {
          console.log("Error", error)
          setEventState({ isLoaded: true, error: error, errorCode: -1, events: [] })
        })
        */
       setEventState({isLoaded: true, error: null, errorCode: 0, events: []})
    }
  }

  function retryHandler() {
    setEventState({ isLoaded: false, error: null, errorCode: 0, events: [] })
  }

  const { isLoaded, error, errorCode, events } = eventState;

  let eventContent = null;

  if (error) {
    eventContent = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={"Aktuell können keine Veranstaltungen geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut." + "(Fehlercode: " + errorCode + ")"}></NoContentView>
  } else if (!isLoaded) {
    eventContent = <NoContentView icon="cloud-download" loading title="Laden der kommenden Veranstaltungen..."></NoContentView>
  } else if (!events || events.length === 0) {
    eventContent = <NoContentView icon="calendar-remove" retryTitle="Aktualisieren" onRetry={retryHandler} title="Kommende Veranstaltungen des Kompetenzzentrums werden hier angezeigt. Akutell stehen keine Veranstaltungen an."></NoContentView>
  } else {
    eventContent = (
      <>
        <HeadingText large weight="bold" style={{marginTop: 16,  marginBottom: 8, marginHorizontal: 8}}>Kommende Veranstaltungen:</HeadingText>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventListItemView
              id={item.id}
              title={item.title}
              short={item.short}
            />
          )}
          keyExtractor={item => item.id}
        />
      </>)
  }

  return (
    <View style={styles.container} >
      <InformationCard style={styles.welcomeCard}>
        <InformationHighlight style={styles.welcomeHeading}>Willkommen</InformationHighlight>
        <InformationText style={styles.welcomeText}> in der Smartfarmcheck-App! In dieser App finden Sie unser Weiterbildungsangebot und Maßnahmen zur Digitalisierung, bewertet für Ihren Betrieb. </InformationText>
      </InformationCard>
      {eventContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  welcomeCard: {
    marginTop: 16,
    marginHorizontal: 8
  }
});


export default EventScreen;