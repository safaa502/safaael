import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import axios from 'axios';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
      .then(response => {
        setPokemonList(response.data.pokemon);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const groupByType = (pokemonList) => {
    return pokemonList.reduce((result, pokemon) => {
      pokemon.type.forEach(type => {
        if (!result[type]) {
          result[type] = [];
        }
        result[type].push(pokemon);
      });
      return result;
    }, {});
  };

  const renderType = (type) => (
    <ListItem containerStyle={{ backgroundColor: '#e8e8e8', marginTop: 10 }}>
      <ListItem.Content>
        <ListItem.Title style={{ fontSize: 24, fontWeight: 'bold' }}>{type}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  const renderPokemonItem = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedPokemon(item); setModalVisible(true); }}>
      <Card style={{ width: '45%', margin: '2.5%' }}>
        <Image style={{ width: '100%', height: 150 }} source={{ uri: item.img }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{item.name}</Text>
        <Text style={{ textAlign: 'center' }}>Type: {item.type.join(', ')}</Text>
      </Card>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal animationType="slide" transparent={false} visible={modalVisible}>
      <View style={{ marginTop: 50 }}>
        <Card>
          <Image style={{ width: 250, height: 250, alignSelf: 'center' }} source={{ uri: selectedPokemon.img }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>{selectedPokemon.name}</Text>
          <Text>Type: {selectedPokemon.type.join(', ')}</Text>
          <Text>Height: {selectedPokemon.height}</Text>
          <Text>Weight: {selectedPokemon.weight}</Text>
          <Button title="Close" onPress={() => { setModalVisible(false); }} />
        </Card>
      </View>
    </Modal>
  );

  const groupedPokemon = groupByType(pokemonList);

  return (
    <View>
      <FlatList
        data={Object.keys(groupedPokemon)}
        renderItem={({ item }) => (
          <View>
            {renderType(item)}
            <FlatList
              data={groupedPokemon[item]}
              renderItem={renderPokemonItem}
              keyExtractor={pokemon => pokemon.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        )}
        keyExtractor={item => item}
      />
      {selectedPokemon && renderModal()}
    </View>
  );
};

export default App;
