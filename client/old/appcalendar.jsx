import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarList } from 'react-native-calendars';
import CustomButton from '../../components/CustomButton';

const events = {
  '2024-05-20': [{ name: 'Event 1', time: '10:00 AM' }],
  '2024-05-22': [{ name: 'Event 2', time: '12:00 PM' }],
  '2024-05-25': [{ name: 'Event 3', time: '3:00 PM' }],
};

const AppCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('year'); // 'year' or 'month'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const renderEvent = (event) => (
    <View key={event.name} className="bg-gray-800 p-4 rounded-lg mb-4 shadow">
      <Text className="text-lg font-bold text-white">{event.name}</Text>
      <Text className="text-base text-gray-400">{event.time}</Text>
    </View>
  );

  const renderYearView = () => {
    const years = Array.from({ length: 70 }, (_, i) => selectedYear - 70 + i);

    return (
      <ScrollView className="flex bg-primary mt-5">
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            className="m-2 p-4 bg-gray-800 rounded-3xl"
            onPress={() => {
              setSelectedYear(year);
              setViewMode('month');
            }}
          >
            <Text className="text-xl font-bold text-white">{year}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMonthView = () => (
    <View className="mt-12">
      <CalendarList
        theme={{
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
          textDayHeaderFontSize: 16,
        }}
        horizontal={true}
        className="bg-black"
        current={`${selectedYear}-01-01`}
        pastScrollRange={0}
        futureScrollRange={11}
        scrollEnabled
        showScrollIndicator
        onVisibleMonthsChange={(months) => {
          if (months[0].year !== selectedYear) {
            setSelectedYear(months[0].year);
          }
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#F6C252', selectedDotColor: '#F6C252' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, marked: true, selectedColor: '#F6C252', dotColor: '#F6C252' },
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1 h-full justify-center">
      {viewMode === 'year' ? (
        renderYearView()
      ) : (
        <>
          <CustomButton
            title="Back to Year View"
            handlePress={() => setViewMode('year')}
            containerStyles="mt-5"
          />
          {renderMonthView()}
        </>
      )}
      <View className="mt-5">
        {selectedDate && events[selectedDate]
          ? events[selectedDate].map(renderEvent)
          : selectedDate && (
              <Text className="text-lg text-gray-400 text-center mt-5">No events for this day.</Text>
            )}
      </View>
    </SafeAreaView>
  );
};

export default AppCalendar;




