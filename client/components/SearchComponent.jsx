import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';

export default function SearchComponent() {
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <SearchBar
      placeholder="Type Here..."
      onChangeText={updateSearch}
      value={search}
    />
  );
}
