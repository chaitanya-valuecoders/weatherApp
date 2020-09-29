import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';

const ref = firestore().collection('locations');

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: [],
      data: '',
      description: '',
      loader: true,
    };
  }

  // Life Cycle method to get the params and to run initial functions -

  componentDidMount() {
    this.setState(
      {
        data:
          this.props.route &&
          this.props.route.params &&
          this.props.route.params.data,
      },
      () => this.runFun(),
    );
  }

  // Initial function container -

  runFun = () => {
    this.getWeather();
    this.getDataFromFireStore();
  };

  // Function to get the data from weather api -

  getWeather = () => {
    const {data} = this.state;
    const cityName = data.city;
    const apiKey = '8d9512d4fb5cc228bf2bf85e05a2cea5';
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
    )
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          loader: false,
          weatherData: res,
        });
      })
      .catch((error) => alert(error));
  };

  // Function to get the data from firestore -

  getDataFromFireStore = () => {
    const {data} = this.state;
    firestore()
      .collection('locations')
      .doc(data && data.latitude.toString())
      .get()
      .then((doc) => {
        if (doc._data !== undefined) {
          this.setState({
            description: doc._data && doc._data.desc,
          });
        }
      });
  };

  // Function to add the data into the firestore -

  addData = async () => {
    const {data, description} = this.state;
    await ref
      .doc(data.latitude.toString())
      .set({
        lat: data.latitude,
        long: data.longitude,
        desc: description,
        name: data.city,
      })
      .then(() => {
        console.warn('Data added!');
      })
      .catch((err) => {
        console.warn('ERROR', err);
      });
  };

  render() {
    const {data, weatherData} = this.state;
    return (
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor="#155491" barStyle="light-content" />
        <View style={styles.subContainer}>
          <View style={styles.firstSubContainer}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.navigate('Home')}>
              <Image
                source={require('../../assets/images/left.png')}
                style={{height: 30, width: 30, tintColor: '#fff'}}
              />
            </TouchableOpacity>
            <View style={{flex: 4}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>
                List of weather forecast
              </Text>
            </View>
          </View>
          <View style={{flex: 1, marginHorizontal: wp('3%')}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Name:</Text>
              <Text style={styles.cityStyle}>{data.city}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Description:
              </Text>
              <TextInput
                value={this.state.description.toString()}
                placeholder="Tap to edit"
                placeholderTextColor="#fff"
                style={{color: '#fff', width: wp('70%')}}
                onEndEditing={this.addData}
                onChangeText={(desc) => {
                  this.setState({
                    description: desc,
                  });
                }}
              />
            </View>
          </View>
          <View style={styles.secondSubContainer}>
            {this.state.loader ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : weatherData && weatherData.list.length > 0 ? (
              <FlatList
                data={weatherData && weatherData.list}
                keyExtractor={(item) => item.dt.toString()}
                renderItem={({item}) => (
                  <View>
                    <View style={styles.tileContainer}>
                      <View
                        style={{
                          flex: 2,
                          padding: 20,
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                          justifyContent: 'center',
                        }}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text
                            style={{}}
                            numberOfLines={this.state.NUM_OF_LINES}>
                            Weather:
                          </Text>
                          {item &&
                            item.weather.map((secondItem, secondIndex) => {
                              return (
                                <Text
                                  key={secondIndex}
                                  style={styles.textStyle}>
                                  {secondItem.description}
                                </Text>
                              );
                            })}
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{}}>Wind Speed:</Text>
                          <Text style={styles.textStyle}>
                            {item.wind && item.wind.speed}
                          </Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={{}}>Time:</Text>
                          <Text style={styles.textStyle}>{item.dt_txt}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                }}>
                No Data Found
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
export default List;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#155491',
  },
  subContainer: {
    flex: 1,
  },
  firstSubContainer: {
    flex: 0.3,
    marginTop: Platform.OS === 'android' ? hp('3%') : hp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  secondSubContainer: {
    flex: 4,
  },
  tileContainer: {
    borderColor: '#fff',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    marginLeft: wp('2%'),
    fontWeight: 'bold',
    flex: 1,
  },
  cityStyle: {
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 5,
    color: '#fff',
  },
});
