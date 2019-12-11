import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Micon from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from '../../firebase';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import AddFlower from '../AddFlower';
import Logout from '../Logout';

class Home extends Component {
  state = {
    recentFlowers: [],
    active: false
  };
  async componentDidMount() {
    try {
      const flowers = [];
      const db = firebase.firestore();
      await db.collection('Flower').onSnapshot(docs => {
        docs.forEach(doc => {
          const docId = doc.id;
          const flower = doc.data();
          flower.id = docId;
          flowers.push(flower);
        });
        this.setState({
          recentFlowers: flowers
        });
      });
    } catch (error) {}
  }

  render() {
    const { recentFlowers, active } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
          >
            <EvilIcons
              name="navicon"
              size={38}
              onPress={() => this.props.navigation.openDrawer()}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flower Snap</Text>
        </View>
        <ScrollView vertical={true}>
          {recentFlowers.map(flower => (
            <View style={styles.flowerItem} key={flower.id}>
              <Image style={styles.imageItem} source={{ uri: flower.image }} />
              <View style={styles.content}>
                <Text style={styles.contentTitle}>{flower.name}</Text>
                {flower.description ? (
                  <Text style={styles.description}>{flower.description}</Text>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  {flower.meaning ? (
                    <Text style={styles.meaning}>{flower.meaning}</Text>
                  ) : (
                    <Text>None</Text>
                  )}
                  <Micon
                    name="heart"
                    size={24}
                    color="#222222"
                    style={active ? styles.btnActive : ''}
                    // onPress={() => this.setState({ active: !active })}
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AddFlower')}
        >
          <Ionicons
            name="ios-add-circle"
            color="#f25979"
            size={60}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f25979',
    width: '100%',
    height: 50,
    marginTop: 30,
    marginBottom: 20,
    padding: 10
  },
  headerTitle: {
    paddingLeft: 15,
    fontWeight: 'bold',
    fontSize: 20
  },
  flowerItem: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#888888',
    borderRadius: 10,
    borderColor: '#888888',
    borderWidth: 1,
    margin: 10
  },
  content: {
    marginLeft: 15
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333333'
  },
  description: {
    width: 140,
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5
  },
  meaning: {
    color: '#FFFFFF',
    backgroundColor: '#666666',
    borderColor: '#666666',
    borderWidth: 2,
    borderRadius: 3,
    padding: 3
  },
  flowerContent: {
    color: '#FFFFFF'
  },
  imageItem: {
    width: 120,
    height: '100%'
  },
  addIcon: {
    textAlign: 'right'
  },
  btnActive: {
    color: '#f25979'
  }
});

const CustomDrawerComponent = props => {
  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30
        }}
      >
        <EvilIcons name="user" size={100} color="#f25979" />
      </View>
      <DrawerItems {...props} />
    </View>
  );
};

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Micon name="home" size={24} color={tintColor} />
        )
      }
    },
    AddFlower: {
      screen: AddFlower,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Ionicons name="ios-add-circle" size={24} color={tintColor} />
        )
      }
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerIcon: ({ tintColor }) => (
          <Micon name="logout" size={24} color={tintColor} />
        )
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent,
    drawerBackgroundColor: '#222222',
    contentOptions: {
      activeTintColor: '#f25979',
      inactiveTintColor: '#FFFFFF',
      activeBackgroundColor: '#444444'
    }
  }
);

export default AppDrawerNavigator;
