import { Dimensions, StyleSheet } from 'react-native';

const scale = 1;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: screenWidth,
    height: screenHeight,
  },

  topBox: {
    width: screenWidth,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 75*scale,
},

  topBoxUpSide: {
    width: screenWidth,
    paddingHorizontal: 18*scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topBoxTitle: {
    width: 98*scale,
    height: 28*scale,
  },

  topBoxUpRightside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 21*scale,
  },

  topBoxSearch: {
    width: 22*scale,
    height: 22*scale,
  },

  topBoxNotification: {
    width: 23*scale,
    height: 26*scale,
  },

  topBoxDownSide: {
    width: screenWidth,
    paddingHorizontal: 18*scale,
    paddingTop: 31*scale,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topBoxDownLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22*scale,
  },
  topBoxDownArrow: {
    width: 23*scale,
    height: 23*scale,
  },

  topBoxDownRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4*scale,
  },
  topBoxMyLocationImg: {
    width: 15*scale,
    height: 15*scale,
  },
  topBoxMyLocationText: { //내위치 텍스트
    fontFamily: 'Pretendard-Regular',
    fontSize: 12*scale,
    color: '#EA6844',
  },

  topToMiddleLine: {
    width: screenWidth,
    height: 2*scale,
    backgroundColor: '#F0F0F0',
    marginTop: 15*scale
  },

  middleAdBox: {
    flex: 1,
    marginVertical: 10,
    alignItems: 'center',
  },

  middleAdImg: {
    width: '95%',
    height: '95%',
    resizeMode: 'contain',
  },

  middleBox: {
    flexDirection: 'column',
  },
  middleTop: {
    flexDirection: 'row',
    paddingHorizontal: 18*scale,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  middleTopText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20*scale,
    color: '#000000',
  },
  middleTopShowAll: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12*scale,
    color: '#9C9C9C',
  },

  middleBottomCase: {
    alignItems: 'center',
    paddingTop: 15*scale,
    paddingBottom: 19*scale,
  },

  middleBottom: {
    backgroundColor: '#ffffffff',
    // iOS 그림자
    shadowColor: '#9A9A9A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android 그림자
    elevation: 10,

    width: screenWidth - 36*scale,
    borderRadius: 28,
    flexDirection: 'column',
    paddingVertical: 20*scale,
    paddingHorizontal: 20*scale,
    justifyContent: 'center',
    gap: 20*scale,
  },

  bottomArrowImage: {
    width: 7*scale,
    height: 14*scale,
  },

  bottomAd: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomAdImage: {
    width: 70*scale,
    height: 70*scale,
    borderRadius: 9,
  },

  eventBox: {
    paddingLeft: 17*scale,
    flex: 1,
  },

  bottomTodays: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12*scale,
    color: '#9C9C9C',
    marginBottom: 5*scale,
  },

  bottomTodaysDescription: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14*scale,
    color: '#292929',
  },

  bottomBox: {
    width: screenWidth,
    height: 100,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // iOS 그림자
    shadowColor: '#9A9A9A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android 그림자
    elevation: 10,
    justifyContent: 'flex-end',
  },

  bottomBoxButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25*scale,
  },

  bottomButton: {
    flexDirection: 'column',
    width: 55*scale,
    height: 69.33*scale,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20.67*scale,
    paddingBottom:8.33*scale,
  },

  bottomText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12*scale,
    color: '#C2C2C2',
    textAlign: 'center',
  },

  bottomHomeIcon: {
    width: 21.25*scale,
    height: 23.24*scale,
    marginBottom: 11.26*scale,
  },

  bottomCommunityIcon: {
    width: 33.3*scale,
    height: 24.99*scale,
    marginBottom: 11.97*scale,
    marginLeft: 3*scale,
  },

  bottomMapIcon: {
    width: 22.67*scale,
    height: 28.33*scale,
    marginBottom: 7.67*scale,
  },

  bottomMyPageIcon: {
    width: 25.5*scale,
    height: 25.5*scale,
    marginBottom: 9.75*scale,
  },

});