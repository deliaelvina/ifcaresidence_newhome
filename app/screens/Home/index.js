import {
  CardChannelGrid,
  CardSlide,
  CategoryList,
  CardReport06,
  News43,
  Price2Col,
  Icon,
  PlaceholderLine,
  Placeholder,
  NewsList,
  SafeAreaView,
  Text,
  Transaction2Col,
  SearchInput,
  TextInput,
  Preview,
  FlatListSlider,
  FlexWrapLayout,
} from '@components';
import {BaseColor, BaseStyle, useTheme, Typography, FontWeight} from '@config';
import {
  HomeChannelData,
  HomeListData,
  HomePopularData,
  HomeTopicData,
  PostListData,
} from '@data';
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  Animated,
  ImageBackground,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import getUser from '../../selectors/UserSelectors';
import HeaderCard from './HeaderCard';
import HeaderHome from './HeaderHome';
import styles from './styles';
import Swiper from 'react-native-swiper';
import Categories from './Categories';
import SliderNews from './SliderNews';
import axios from 'axios';
import * as Utils from '@utils';
import numFormat from '../../components/numFormat';

import {notifikasi_nbadge, actionTypes} from '../../actions/NotifActions';
import getNotifRed from '../../selectors/NotifSelectors';
import getProject from '../../selectors/ProjectSelector';
import {data_project} from '../../actions/ProjectActions';
import messaging from '@react-native-firebase/messaging';
import apiCall from '../../config/ApiActionCreator';
// import {TextInput} from '../../components';

import LinearGradient from 'react-native-linear-gradient';
import ModalSelector from 'react-native-modal-selector';

import MasonryList from '@react-native-seoul/masonry-list';
import { ActivityIndicator } from 'react-native-paper';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const imagesdummy = [
  {
    rowID: '1',
    image: require('@assets/images/image-home/news/image1.jpeg'),
    news_id: 'N',
  },
  {
    rowID: '2',
    image: require('@assets/images/image-home/news/image1.jpeg'),
    announce_id: 'A',
  },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
  //   desc: 'Silent Waters in the mountains in midst of Himilayas',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
  //   desc: 'Red fort in India New Delhi is a magnificient masterpeiece of humans',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  //   desc: 'Sample Description below the image for representation purpose only',
  // },
];

const eventdummy = [
  {
    id: '1',
    pict: 'https://ii1.pepperfry.com/media/catalog/product/m/o/568x625/modern-chaise-lounger-in-grey-colour-by-dreamzz-furniture-modern-chaise-lounger-in-grey-colour-by-dr-tmnirx.jpg',
    text: 'Pioneer LHS Chaise Lounger in Grey Colour',
  },
  {
    id: '2',
    pict: 'https://www.precedent-furniture.com/sites/precedent-furniture.com/files/styles/header_slideshow/public/3360_SL%20CR.jpg?itok=3Ltk6red',
    text: 'Precedant Furniture',
  },
  {
    id: '3',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/leverette-fabric-queen-upholstered-platform-bed-1594829293.jpg',
    text: 'Leverette Upholstered Platform Bed',
  },
  {
    id: '4',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/briget-side-table-1582143245.jpg?crop=1.00xw:0.770xh;0,0.129xh&resize=768:*',
    text: 'Briget Accent Table',
  },
  {
    id: '5',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/rivet-emerly-media-console-1610578756.jpg?crop=1xw:1xh;center,top&resize=768:*',
    text: 'Rivet Emerly Media Console',
  },
  {
    id: '6',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/drew-barrymore-flower-home-petal-chair-1594829759.jpeg?crop=1xw:1xh;center,top&resize=768:*',
    text: 'Drew Barrymore Flower Home Accent Chair',
  },
  {
    id: '7',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/drew-barrymore-flower-home-petal-chair-1594829759.jpeg?crop=1xw:1xh;center,top&resize=768:*',
    text: 'Drew Barrymore Flower Home Accent Chair',
  },
  {
    id: '8',
    pict: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/drew-barrymore-flower-home-petal-chair-1594829759.jpeg?crop=1xw:1xh;center,top&resize=768:*',
    text: 'Drew Barrymore Flower Home Accent Chair',
  },
];

const sliceArrEvent = eventdummy.slice(0, 6); //ini membatasi load data dari mobile, bukan dari api
// console.log('slice array event', sliceArrEvent);

const Home = props => {
  const {navigation, route} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [topics, setTopics] = useState(HomeTopicData);
  const [channels, setChannels] = useState(HomeChannelData);
  const [popular, setPopular] = useState(HomePopularData);
  const [list, setList] = useState(HomeListData);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => getUser(state));
  const notif = useSelector(state => getNotifRed(state));
  const project = useSelector(state => getProject(state));
  console.log('project selector', project);
  console.log('cobanotif di home', notif);
  // const email = user.user;
  const [email, setEmail] = useState(user != null ? user.user : '');
  console.log('user di home', user);
  const [fotoprofil, setFotoProfil] = useState(
    user != null
      ? {uri: user.pict}
      : require('../../assets/images/image-home/Main_Image.png'),
  );
  const [name, setName] = useState(user != null ? user.name : '');
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const scrollY = useRef(new Animated.Value(0)).current;
  const [getDataDue, setDataDue] = useState([]);
  const [getDataNotDue, setDataNotDue] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [data, setData] = useState([]);
  const {width} = Dimensions.get('window');
  const [getDataHistory, setDataHistory] = useState([]);

  const [dataTowerUser, setdataTowerUser] = useState([]);
  const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  // const [entity_cd, setEntity] = useState('01');
  // const [project_no, setProjectNo] = useState('01');
  const [entity_cd, setEntity] = useState(project.Data[0].entity_cd);
  const [project_no, setProjectNo] = useState(project.Data[0].project_no);
  const [lotno, setLotno] = useState([]);
  console.log('lotno array 0', lotno.lot_no);
  const [text_lotno, setTextLotno] = useState('');
  const [default_text_lotno, setDefaultLotno] = useState(true);
  const [keyword, setKeyword] = useState('');

  const [newsannounce, setNewsAnnounce] = useState([]);
  const [newsannounceslice, setNewsAnnounceSlice] = useState([]);
  const [loadNewsAnnounce, setLoadNews] = useState(true)

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Notification', remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          navigation.navigate('Notification', remoteMessage);
        }
        setLoading(false);
      });
  }, []);

  //untuk load badge notif
  useEffect(() => {
    dispatch(
      apiCall(
        `http://34.87.121.155:8181/apiwebpbi/api/notification?email=${email}&entity_cd=01&project_no=01`,
      ),
    );
  }, []);

  async function getLotNo() {
    console.log(
      'url api lotno',
      'http://34.87.121.155:2121/apiwebpbi/api/facility/book/unit?entity=' +
        entity_cd +
        '&' +
        'project=' +
        project_no +
        '&' +
        'email=' +
        email,
    );
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/facility/book/unit?entity=` +
          entity_cd +
          '&' +
          'project=' +
          project_no +
          '&' +
          'email=' +
          email,
      );
      const resLotno = res.data.data;
      console.log('reslotno', resLotno);

      setLotno(resLotno);

      if (default_text_lotno == true) {
        setTextLotno(resLotno[0].lot_no);
      }

      setSpinner(false);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  const notifUser = useCallback(
    (entity_cd, project_no) =>
      dispatch(notifikasi_nbadge(email, entity_cd, project_no)),
    [email, entity_cd, project_no, dispatch],
  );

  const dataImage = async () => {
    await axios
      .get(`http://34.87.121.155:2121/apiwebpbi/api/about/image`)
      .then(res => {
        console.log('res image', res.data.data);
        // console.log('data images', res.data[0].images);
        setData(res.data.data);
        // return res.data;
      })
      .catch(error => {
        console.log('error get about us image', error);
        // alert('error get');
      });
  };

  const dataNewsAnnounce = async () => {
    await axios
      .get(`http://34.87.121.155:2121/apiwebpbi/api/news-announce`)
      .then(res => {
        console.log('RES newsss announce', res.data.data);
        // console.log('data images', res.data[0].images);
        const datanews = res.data.data;
        const slicedatanews = datanews.slice(0, 6);
        console.log('slice data', slicedatanews);
        setNewsAnnounceSlice(slicedatanews);
        setNewsAnnounce(datanews);
        setLoadNews(false)
        // return res.data;
      })
      .catch(error => {
        console.log('error get dataNewsAnnounce', error);
        // alert('error get');
      });
  };

  async function fetchDataDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataDueSummary/IFCAPB/${user.user}`,
      );
      setDataDue(res.data.Data);
      console.log('data get data due', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function fetchDataNotDue() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getDataCurrentSummary/IFCAPB/${user.user}`,
      );
      setDataNotDue(res.data.Data);
      console.log('data get data not due', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

  async function fetchDataHistory() {
    try {
      const res = await axios.get(
        `http://34.87.121.155:2121/apiwebpbi/api/getSummaryHistory/IFCAPB/${user.user}`,
      );
      setDataHistory(res.data.Data);
      // console.log('data get history', res.data.Data);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  }

 

  const galery = [...data];

  //TOTAL DATE DUE
  const sum =
    getDataDue == 0
      ? 0
      : getDataDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  console.log('sum', sum);

  //TOTAL DATE NOT DUE
  const sumNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : getDataNotDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0);

  console.log('sumNotDue', sumNotDue);

  const math_total = Math.floor(sumNotDue) + Math.floor(sum);
  console.log('math total', math_total);

  const sumHistory =
    getDataHistory == null
      ? 0
      : getDataHistory.reduceRight((max, bills) => {
          return (max += parseInt(bills.mdoc_amt));
        }, 0);

  console.log('sumHistory', sumHistory);

  //LENGTH
  const onSelect = indexSelected => {};

  const unique =
    getDataDue == 0 ? 0 : [...new Set(getDataDue.map(item => item.doc_no))];
  console.log('unique', unique);

  const uniqueNotDue =
    getDataNotDue == 0 || getDataNotDue == null
      ? 0
      : [...new Set(getDataNotDue.map(item => item.doc_no))];
  console.log('uniqueNotDue', uniqueNotDue);

  const invoice = unique == 0 ? 0 : unique.length;
  console.log('invoice', invoice);

  const invoiceNotDue = uniqueNotDue == 0 ? 0 : uniqueNotDue.length;
  console.log('invoiceNotDue', invoiceNotDue);

  const total_outstanding = Math.floor(invoice) + Math.floor(invoiceNotDue);
  console.log('total_outstanding', total_outstanding);

  const uniqueHistory =
    getDataHistory == null
      ? 0
      : [...new Set(getDataHistory.map(item => item.doc_no))];
  // console.log('uniqueHistory', uniqueHistory);

  const invoiceHistory = uniqueHistory.length;
  console.log('invoiceHistory', invoiceHistory);

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //For header image opacity
  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  //artist profile image position from top
  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader],
    outputRange: [250, heightHeader],
    useNativeDriver: true,
  });

  useEffect(() => {
    console.log('galery', galery);
    dataImage();
    dataNewsAnnounce();
    console.log('datauser', user);
    console.log('about', data);
    fetchDataDue();
    fetchDataNotDue();
    fetchDataHistory();

    getLotNo();
    notifUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    // getNewsAnnounce();
  }, []);

  const goPostDetail = item => () => {
    navigation.navigate('PostDetail', {item: item});
  };

  const onChangeText = text => {
    setKeyword(text);
    // setCategory(
    //   text
    //     ? category.filter(item => item.title.includes(text))
    //     : CategoryData,
    // );
  };

  const onChangelot = lot => {
    setDefaultLotno(false);
    console.log('lot', lot);
    setTextLotno(lot);
  };

  const CardItem = ({item}) => {
    return (
      <View key={item.id} style={([styles.shadow], {})}>
        <Image
          source={{uri: item.pict}}
          style={
            ([styles.shadow],
            {
              height: item.id % 2 ? 300 : 200,
              width: 200,
              margin: 5,
              borderRadius: 10,
              alignSelf: 'stretch',
            })
          }
          resizeMode={'cover'}></Image>
      </View>
    );
  };

  const renderContent = () => {
    const mainNews = PostListData[0];

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, {flex: 1}]}
        edges={['right', 'top', 'left']}>
        {user == null || user == '' ? (
          <Text>data user dihome null</Text>
        ) : // <HeaderHome />
        null}

        <ScrollView
          // contentContainerStyle={styles.paddingSrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{flex: 1}}>
            <ImageBackground
              // source={require('../../assets/images/image-home/Main_Image.png')}
              source={require('../../assets/images/image-home/Pakubuwono.jpeg')}
              style={
                {
                  // height: '100%',
                  // height: 400,
                  // width: '100%',
                  // flex: 1,
                  // resizeMode: 'cover',
                  // borderBottomLeftRadius: 500,
                  // borderBottomRightRadius: 175,
                }
              }
              imageStyle={{
                height: 400,
                width: '100%',
                borderBottomLeftRadius: 175,
                borderBottomRightRadius: 175,
              }}>
              <LinearGradient
                colors={['rgba(73, 73, 73, 0)', 'rgba(73, 73, 73, 1)']}
                // colors={['#4c669f', '#3b5998', '#192f6a']}
                // {...otherGradientProps}
                style={{
                  height: 400,
                  // height: '85%',
                  width: '100%',

                  flexDirection: 'column',
                  // flex: 1,
                  justifyContent: 'center',
                  // top: 30,
                  borderBottomLeftRadius: 175,
                  borderBottomRightRadius: 175,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'center',
                    top: 30,
                  }}>
                  {/* ------- TEXT WELCOME HOME ------- */}
                  <View
                    style={{
                      // flex: 1,
                      alignItems: 'center',

                      left: 47,
                      justifyContent: 'center',

                      width: '50%',
                    }}>
                    <Text
                      style={{
                        fontSize: 50,
                        color: 'white',
                        fontFamily: 'DMSerifDisplay',
                        lineHeight: 55,
                      }}>
                      Welcome Home
                    </Text>
                  </View>
                  {/* ------- CLOSE TEXT WELCOME HOME ------- */}

                  {/* ----- SEARCH INPUT ----- */}
                  {/* <View
                    style={{
                      // flex: 1,
                      alignItems: 'center',
                      left: 47,
                      justifyContent: 'center',
                      width: '80%',
                    }}>
                    <SearchInput
                      style={[BaseStyle.textInput, Typography.body1]}
                      onChangeText={onChangeText}
                      autoCorrect={false}
                      placeholder={t('Explore your luxury lifestyle')}
                      placeholderTextColor={BaseColor.grayColor}
                      value={keyword}
                      selectionColor={colors.primary}
                      onSubmitEditing={() => {}}
                      icon={
                        <Icon
                          name="search"
                          solid
                          size={24}
                          color={colors.primary}
                        />
                      }
                    />
                  </View> */}

                  <View style={{alignItems: 'center', top: 15}}>
                    <Image
                      style={{
                        height: 70,
                        width: '50%',
                      }}
                      source={require('../../assets/images/image-home/vector-logo-pbi.png')}></Image>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 35,
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Image
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
              }}
              // source={require('../../assets/images/image-home/Main_Image.png')}
              source={fotoprofil}></Image>
            <View style={{alignSelf: 'center', marginLeft: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginVertical: 3,
                    fontFamily: 'DMSerifDisplay',
                  }}>
                  {/* Nama pemilik */}
                  {name}
                </Text>
                <Icon
                  name="star"
                  solid
                  size={18}
                  color={colors.primary}
                  style={{marginHorizontal: 5}}
                />
              </View>

              <View
                style={{
                  backgroundColor: '#315447',
                  height: 30,
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}>
                <View style={{flexDirection: 'row', paddingLeft: 10}}>
                  <Text
                    style={{
                      color: '#fff',
                      alignSelf: 'center',
                      fontSize: 14,
                      justifyContent: 'center',
                      paddingRight: 10,

                      fontWeight: '800',
                      fontFamily: 'KaiseiHarunoUmi',
                    }}>
                    Unit
                  </Text>

                  <ModalSelector
                    style={{justifyContent: 'center', alignSelf: 'center'}}
                    childrenContainerStyle={{
                      color: '#CDB04A',
                      alignSelf: 'center',
                      fontSize: 16,
                      // top: 10,
                      // flex: 1,
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontFamily: 'KaiseiHarunoUmi',
                    }}
                    data={lotno}
                    optionTextStyle={{color: '#333'}}
                    selectedItemTextStyle={{color: '#3C85F1'}}
                    accessible={true}
                    keyExtractor={item => item.lot_no}
                    initValue={'ahlo'}
                    labelExtractor={item => item.lot_no} //khusus untuk lotno
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    onChange={option => {
                      onChangelot(option);
                    }}>
                    <Text
                      style={{
                        color: '#CDB04A',
                        alignSelf: 'center',
                        fontSize: 16,
                        // top: 10,
                        // flex: 1,
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontFamily: 'KaiseiHarunoUmi',
                      }}>
                      {text_lotno}
                    </Text>
                  </ModalSelector>
                  <Icon
                    name="caret-down"
                    solid
                    size={26}
                    // color={colors.primary}
                    style={{marginLeft: 5}}
                    color={'#CDB04A'}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.paddingContent}>
            {user == null || user == '' ? (
              <Text>user not available</Text>
            ) : (
              <Categories style={{marginTop: 10}} />
            )}
          </View>

          <View style={{marginBottom: 10, flex: 1}}>
            <View style={{marginLeft: 30, marginTop: 20, marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}>
                Our Bulletin
              </Text>
              <Text>News and Announcement</Text>
            </View>
            <View style={{marginVertical: 15}}>
              {loadNewsAnnounce ? <ActivityIndicator/> : <SliderNews
                data={newsannounceslice}
                local={true}
                // onPress={console.log('klik')}
              />}
              
            </View>
          </View>

          <View style={{marginBottom: 20, flex: 1}}>
            <View style={{marginLeft: 30, marginTop: 20, marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}>
                This Weekend
              </Text>
              <Text>Event And Restaurant</Text>
            </View>
            <View style={{marginVertical: 10, marginHorizontal: 10}}>
              <ScrollView horizontal>
                <MasonryList
                  data={eventdummy}
                  style={{alignSelf: 'stretch'}}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    alignSelf: 'stretch',
                    // alignSelf: 'flex-start',
                  }}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  renderItem={CardItem}
                />
              </ScrollView>
            </View>
          </View>

          <View style={{marginBottom: 20, flex: 1}}>
            <View style={{marginLeft: 30, marginTop: 20, marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 24,
                  // color: 'white',
                  fontFamily: 'DMSerifDisplay',
                }}>
                Club And Facilities
              </Text>
              <Text>Check Our Promo Here</Text>
            </View>
            <View style={{marginVertical: 10, marginHorizontal: 10}}>
              <ScrollView horizontal>
                <FlatList
                  pagingEnabled={true}
                  decelerationRate="fast"
                  bounces={false}
                  data={eventdummy}
                  numColumns={3}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('PreviewImages', {
                          images: eventdummy,
                        })
                      }>
                      <View key={item.id} style={{}}>
                        <Image
                          source={{uri: item.pict}}
                          style={
                            ([styles.shadow],
                            {
                              height: 300,
                              margin: 5,
                              width: 220,
                              borderRadius: 10,
                            })
                          }
                          resizeMode={'cover'}></Image>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => item.toString() + index}
                />
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default Home;
