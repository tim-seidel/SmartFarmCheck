import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import NoContentView from '../components/NoContentView';
import EventListItemView from '../components/EventViewListItem';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';

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

class EventScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      events: []
    }
  }

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents() {
    if (!this.state.isLoaded) {
      /*
        fetch('https://pas.coala.digital/v1/events', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    events: json,
                    error: null
                })
            })
            .catch(error => {
                console.log("Error", error)
                this.setState({
                    isLoaded: false,
                    error: error
                })
            })
            */
      this.setState({
        isLoaded: true,
        events: [],
        error: null
      })
    }
  }

  onRetryHandler() {
    this.setState({
      isLoaded: false,
      error: null
    }, this.loadEvents.bind(this));
  }

  render() {
    const { error, isLoaded, events } = this.state;

    let eventContent = null;

    if (error) {
      eventContent =  <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell können keine Veranstaltungen geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else if (!isLoaded) {
      eventContent =  <NoContentView icon="cloud-download" loading title="Laden der kommenden Veranstaltungen..."></NoContentView>
    } else if (!events || events.length === 0) {
      eventContent = <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell konnten keine Veranstaltungen gefunden werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else {
      eventContent = (
        <>
          <Text style={styles.listHeading}>Demnächst:</Text>
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
        <InformationCard style ={styles.welcomeCard}>
            <InformationHighlight style={styles.welcomeHeading}>Willkommen</InformationHighlight>
            <InformationText style={styles.welcomeText}> in der Smartfarmcheck-App! In dieser App finden Sie unser Weiterbildungsangebot und Maßnahmen zur Digitalisierung, bewertet für Ihren Betrieb. </InformationText>
        </InformationCard>
        {eventContent}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  welcomeCard: {
    marginTop: 16,
    marginHorizontal: 8
  },
  listHeading: {
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 8
  }
});


export default EventScreen;