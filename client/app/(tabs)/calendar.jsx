import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, Animated, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

const AppCalendar = () => {
  const [birthday, setBirthday] = useState('1990-01-01'); 
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);

  const [opacity] = useState(new Animated.Value(0)); 
  const [translateY] = useState(new Animated.Value(100));

  const showCalendar = (month) => {
    setSelectedMonth(month); 
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const hideCalendar = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 100,
        duration: 50,
        useNativeDriver: true
      })
    ]).start(() => setSelectedMonth(null));
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: new Animated.Value(0) } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationY > 100) {
        hideCalendar();
      }
    }
  };

  return (
    <SafeAreaView style={styles.root}>
    <GestureHandlerRootView>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Your life in months:
        </Text>
        <TouchableOpacity onPress={() => { setSortAscending((prev) => !prev) }} style={styles.sortButton}>
          <AntDesign name={sortAscending ? 'up' : 'down'} size={15} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={{ flex: 1, backgroundColor: '#090909' }}>
        <MonthGrid 
          birthday={birthday}
          postsData={postsData}
          showCalendar={showCalendar}
          sortAcscending={sortAscending}
        />
        {selectedMonth && (
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}>
            <Animated.View style={{
              opacity: opacity,
              transform: [{ translateY }],
              height: styles.calendarContainer.height, 
              overflow: 'hidden'
            }}>
              <CalendarView month={selectedMonth} />
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
    </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const calculateMonths = (startDate, sortAcscending) => {
  const start = moment(startDate);
  const end = moment();
  const months = [];
  while (start.isBefore(end)) {
    months.push(start.format('YYYY-MM'));
    start.add(1, 'month');
  }
  return sortAcscending ? months : months.reverse();
};

const getColorForPosts = (numPosts) => {
  if (numPosts === 0) return '#EBEDF0'; // Gray for no posts
  if (numPosts === 1) return '#AED9AF'; // Vibrant light green for one post
  if (numPosts === 2) return '#82C987'; // More saturated green for two posts
  if (numPosts === 3) return '#5BB66D'; // Deeper green for three posts
  return '#309F50'; // Rich dark green for four or more posts
};

const MonthGrid = ({ birthday, postsData, sortAcscending, showCalendar }) => {
  const months = calculateMonths(birthday, sortAcscending);

  return (
    <View style={styles.grid}>
      <FlatList
        data={months}
        numColumns={12} 
        renderItem={({ item }) => {
          const numPosts = postsData[item] || 0; 
          const backgroundColor = getColorForPosts(numPosts);
          return (
            <TouchableOpacity 
              onPress={() => showCalendar(item)}
              style={[styles.monthSquare, { backgroundColor }]}>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    </View>
  );
};

const CalendarView = ({ month }) => {
  // Dummy data for posts
  const markedDates = {
    '2024-01-01': { selected: true, selectedColor: 'green' },
    '2024-02-15': { selected: true, selectedColor: 'green' },
    '2024-02-28': { selected: true, selectedColor: 'green' },
    '2024-03-03': { selected: true, selectedColor: 'green' },
    '2024-03-06': { selected: true, selectedColor: 'green' },
    '2024-03-26': { selected: true, selectedColor: 'green' },
    '2024-04-20': { selected: true, selectedColor: 'green' },
    '2024-04-21': { selected: true, selectedColor: 'green' },
    '2024-04-22': { selected: true, selectedColor: 'green' },
    '2024-04-23': { selected: true, selectedColor: 'green' },
    '2024-05-15': { selected: true, selectedColor: 'green' },
    '2024-05-18': { selected: true, selectedColor: 'green' },
    '2024-05-19': { selected: true, selectedColor: 'green' },
    '2024-06-06': { selected: true, selectedColor: 'green' },
    '2024-06-28': { selected: true, selectedColor: 'green' },
    // Add dates based on the user's posts
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        key={month}
        current={month}
        markedDates={markedDates}
        theme={calendarTheme}
        hideExtraDays={true} 
        showSixWeeks={true}
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { 
    flex: 1,
    backgroundColor: '#090909',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 100
  },
  headerText: {
    color: '#D1D5DB', 
    fontSize: 24, 
    fontWeight: 'bold',
    marginLeft: 25, 
  },
  grid: {
    flex: .86, 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 5,
  },
  monthSquare: {
    width: 22, 
    height: 22, 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, 
    backgroundColor: '#40C463',
    borderRadius: 3,
  },
  calendarContainer: {
    flex: .89, 
    height: 400,  
    overflow: 'hidden'
  },
  sortButton: {
    backgroundColor: '#FBC457',
    marginLeft: 140,
    width: 22, 
    height: 22, 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, 
    borderRadius: 3,
  }
});

const calendarTheme = {  
  backgroundColor: '#090909',      
  calendarBackground: '#090909',    
  textSectionTitleColor: '#CDCDE0', 
  selectedDayBackgroundColor: '#F6C252', 
  selectedDayTextColor: '#000',    
  todayTextColor: '#F6C252',        
  dayTextColor: '#CDCDE0',          
  textDisabledColor: '#2D2D2D',   
  dotColor: '#F6C252',              
  selectedDotColor: '#000',         
  arrowColor: '#FBC457',            
  monthTextColor: '#FBC457',        
  indicatorColor: '#F5BC60',       
  textDayFontWeight: '300',         
  textMonthFontWeight: 'bold',      
  textDayHeaderFontWeight: '300',   
  textDayFontSize: 16,            
  textMonthFontSize: 16,            
  textDayHeaderFontSize: 15         
}

const postsData = {
  '2024-01': 1,
  '2024-02': 2,
  '2024-03': 3,
  '2024-04': 4,
  '2024-05': 3,
  '2024-06': 2,
};

export default AppCalendar;