import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import MapView, {
  Marker,
  Callout,
  CalloutSubview,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
// import CustomCallout from '../../components/CustomCallout/CustomCallout';
import Locations from '../../utils/location.json';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 40.7127837;
const LONGITUDE = -74.0059413;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cnt: 0,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
    };
  }

  // Life Cycle method to get the markers from the Json File
  componentDidMount() {
    this.setState({
      markers: Locations,
    });
  }

  // Function for redireaction to different screen
  calloutPress(item) {
    this.props.navigation.navigate('List', {
      data: item,
    });
  }

  render() {
    const {region, markers} = this.state;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={region}
          zoomTapEnabled={false}>
          {markers.map((item, index) => {
            return (
              <Marker
                coordinate={item}
                key={index}
                onCalloutPress={() => this.calloutPress(item)}>
                <Callout
                  style={styles.plainView}
                  onPress={() => this.calloutPress()}>
                  <View>
                    <Text>{item.city}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        <View style={styles.buttonContainer}>
          <View
            style={{
              ...styles.bubble,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Tap on markers to see different locations</Text>
          </View>
        </View>
      </View>
    );
  }
}

Home.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  plainView: {
    padding: 10,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    backgroundColor: 'transparent',
  },
});

export default Home;
