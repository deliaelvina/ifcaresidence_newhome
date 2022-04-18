import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
// import {NotificationData} from '@data';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
// import getUser from '../../selectors/UserSelectors';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

const PDFAttach = props => {
  const {navigation, route} = props;
  console.log('route params', route);
  const paramsItem = route.params;
  const {t} = useTranslation();
  const {colors} = useTheme();
  //   const [refreshing, setRefreshing] = useState(false);
  //   const [notification, setNotification] = useState(NotificationData);
  //   const users = useSelector(state => getUser(state));
  //   const [email, setEmail] = useState(users.user);
  //   const [loading, setLoading] = useState(true);
  //   const [dataTowerUser, setdataTowerUser] = useState([]);
  //   const [arrDataTowerUser, setArrDataTowerUser] = useState([]);
  //   const [spinner, setSpinner] = useState(true);
  //   const [dataNotif, setDataNotif] = useState([]);
  const downloadFile = () => {
    const url = paramsItem.link_url;
    const android = RNFetchBlob.android;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        path:
          RNFetchBlob.fs.dirs.SDCardDir +
          '/downloads/' +
          paramsItem.doc_no +
          '_' +
          paramsItem.remark +
          '.pdf',
        useDownloadManager: true,
        notification: true,
        overwrite: true,
        description: 'downloading content...',
        mime: 'application/pdf',
        mediaScannable: true,
      },
    })
      .fetch('GET', url)
      .then(res => {
        console.log('The file saved to ', res.path());
        alert('Saved at : ' + res.path());
        // android.actionViewIntent(res.path(), 'application/pdf')
        // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
      });
  };

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Attachment Invoice')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name="download"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressRight={() => {
          downloadFile();
        }}
      />
      <View style={{flex: 1}}>
        <Pdf
          source={{
            uri: paramsItem.link_url,
            cache: true,
          }}
          // source={require('@assets/termsconditions/Facility_Booking_System_Regulation.pdf')}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          password={'220359'}
          style={stylesCurrent.pdf}
          fitWidth={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default PDFAttach;

const stylesCurrent = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
