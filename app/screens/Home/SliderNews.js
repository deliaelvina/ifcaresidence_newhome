import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  createRef,
} from 'react';
import {useNavigation} from '@react-navigation/core';
import {
  FlatList,
  ScrollView,
  View,
  Image,
  Animated,
  ImageBackground,
  RefreshControl,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import {Header, SafeAreaView, Icon} from '@components';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

const SliderNews = ({
  style = {},
  separatorWidth = 0,
  contentContainerStyle = {},
  data = [],
  //   item,
  imageKey,
  //   onPress,
  //   index,
  active,
  local,
  loop = false,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const slider = createRef();
  const navigation = useNavigation();
  const itemWidth = Math.round(Dimensions.get('window').width);
  //   const separatorWidth = separatorWidth;
  const totalItemWidth = itemWidth + separatorWidth;

  const [index, setIndex] = useState('');
  //   const [data, setData] = useState([]);

  //   const onViewableItemsChanged = ({viewableItems, changed}) => {
  //     console.log('onViewableItemsChanged Calling on Scroll...');
  //     // if (viewableItems.length > 0) {
  //     //   console.log('object', viewableItems[0].index);
  //     //   //   let currentIndex = viewableItems[0].index;
  //     //   //   if (currentIndex % data.length === data.length - 1 && loop) {
  //     //   //     setIndex(currentIndex);
  //     //   //     setData([...data, ...data]);
  //     //   //   } else {
  //     //   //     setIndex(currentIndex);
  //     //   //   }

  //     //   //   if (currentIndexCallback) {
  //     //   //     currentIndexCallback(currentIndex);
  //     //   //   }
  //     // }
  //   };
  const onViewableCall = () => {
    console.log('onViewableItemsChanged Calling on Scroll...');
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  const goPostDetail = item => {
    console.log('for news', item);

    item.category == 'N' ? getNewsDetail(item) : getAnnounceDetail(item);
  };

  const getNewsDetail = async item => {
    console.log('rowid for detail', item.rowID);
    await axios
      .get(`http://34.87.121.155:8000/apiwebpbi/api/news/id/${item.rowID}`)
      .then(res => {
        console.log('res news detail', res.data.data);

        navigation.navigate('PostDetail', {item: res.data.data});
      })
      .catch(error => {
        console.log('error get news announce detail', error);
        // alert('error get');
      });
  };

  const getAnnounceDetail = async item => {
    console.log('rowid for detail', item.rowID);
    await axios
      .get(
        `http://34.87.121.155:8000/apiwebpbi/api/announce/id/${item.rowID}`,
      )
      .then(res => {
        console.log('res announce detail', res.data.data);

        navigation.navigate('AnnouceDetail', {item: res.data.data});
      })
      .catch(error => {
        console.log('error get news announce detail', error);
        // alert('error get');
      });
  };

  return (
    <FlatList
      ref={slider}
      horizontal
      pagingEnabled={true}
      snapToInterval={totalItemWidth}
      decelerationRate="fast"
      bounces={false}
      contentContainerStyle={contentContainerStyle}
      data={data}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <TouchableOpacity
          //   style={[styles.videoContainer]}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            marginHorizontal: 10,

            // marginRight: 10,
            // marginLeft: 10,
          }}
          //   onPress={() => onPress(item)}
          onPress={() => goPostDetail(item)}>
          <View style={[styles.imageContainer, styles.shadow]}>
            <Image
              //   style={[
              //     styles.videoPreview,
              //     active ? {} : {height: 220, width: 300},
              //   ]}
              style={{
                height: 220,
                width: 370,
                resizeMode: 'cover',
                // marginHorizontal: 10,
                borderRadius: 10,
              }}
              source={{uri: item.url_image}}
              // source={item.url_image}
              //   source={local ? item.image : {uri: item.image}}
            />
            {/* <Text>{item.image}</Text> */}
          </View>
          {/* <Text style={styles.desc}>{item.desc}</Text> */}
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={{width: separatorWidth}} />}
      keyExtractor={(item, index) => item.toString() + index}
    />
  );
};
export default SliderNews;

const styles = StyleSheet.create({
  videoContainer: {
    width: 275,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  videoPreview: {
    width: 275,
    // height: 155,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
