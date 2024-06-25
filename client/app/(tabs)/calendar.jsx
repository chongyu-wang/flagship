import moment from 'moment';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AppCalendar = () => {
  const [birthday] = useState('1990-01-01'); 
  const [selectedMonth, setSelectedMonth] = useState(null);

  console.log("Selected Month:", selectedMonth);

  return (
    <View style={{ flex: 1, backgroundColor: '#090909' }}>
      <MonthGrid birthday={birthday} setSelectedMonth={setSelectedMonth} />
      <CalendarView month={selectedMonth} />
    </View>
  );
};

const calculateMonths = (startDate) => {
  const start = moment(startDate);
  const end = moment();
  const months = [];
  while (start.isBefore(end)) {
    months.push(start.format('YYYY-MM'));
    start.add(1, 'month');
  }
  return months;
};

const MonthGrid = ({ birthday, setSelectedMonth }) => {
  const months = calculateMonths(birthday);

  return (
    <View style={styles.grid}>
      <FlatList
        data={months}
        numColumns={12} 
        renderItem={({ item }) => (
          <TouchableOpacity 
          onPress={() => setSelectedMonth(item)}
          style={styles.monthSquare}>
            <View style={styles.monthSquare}>
              
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
    </View>
  );
};

const CalendarView = ({ month }) => {
  if (!month) return null;

  // Dummy data for posts
  const markedDates = {
    '2023-05-01': { selected: true, selectedColor: 'green' },
    '2023-05-15': { selected: true, selectedColor: 'green' }
    // Add more dates based on the user's posts
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        key={month}
        current={month}
        markedDates={markedDates}
        theme={calendarTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: .826, 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50,
    backgroundColor: '#090909', 
  },
  monthSquare: {
    width: 21, 
    height: 21, 
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5, 
    backgroundColor: '#40C463',
    borderRadius: 3,
  },
  monthText: {
    color: '#FBC457', 
    fontWeight: 'bold',
  },
  calendarContainer: {
    height: 350,  
    overflow: 'hidden'
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
  arrowColor: '#F5BC60',            
  monthTextColor: '#FBC457',        
  indicatorColor: '#F5BC60',       
  textDayFontWeight: '300',         
  textMonthFontWeight: 'bold',      
  textDayHeaderFontWeight: '300',   
  textDayFontSize: 16,            
  textMonthFontSize: 16,            
  textDayHeaderFontSize: 16         
}

export default AppCalendar;