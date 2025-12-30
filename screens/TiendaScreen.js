import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Text, FAB, Card, Button, Searchbar, Chip } from 'react-native-paper';

const COLORS = { gold: '#d4af37', black: '#000000', white: '#ffffff' };

export default function TiendaScreen() {
  const [products, setProducts] = useState([
    { id: '1', name: 'Shampoo Hipoalergénico', price: 25000, stock: 10, category: 'Higiene' },
    { id: '2', name: 'Correa de Cuero', price: 45000, stock: 5, category: 'Accesorios' },
    { id: '3', name: 'Alimento Premium 1kg', price: 18000, stock: 20, category: 'Alimento' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEdit = (product) => {
      // Mock Edit
      Alert.alert('Editar', `Editar stock de ${product.name}`);
  };

  const handleDelete = (id) => {
      setProducts(prev => prev.filter(p => p.id !== id));
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
             <Chip icon="package-variant" style={{ backgroundColor: item.stock < 5 ? '#ffcccb' : '#e0e0e0' }}>
                 Stock: {item.stock}
             </Chip>
             <View style={styles.actions}>
                <Button textColor={COLORS.gold} onPress={() => handleEdit(item)}>Editar</Button>
                <Button textColor="#d32f2f" onPress={() => handleDelete(item.id)}>X</Button>
             </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar productos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      
      <FAB
        icon="plus"
        label="Nuevo Producto"
        style={styles.fab}
        onPress={() => Alert.alert('Nuevo', 'Agregar producto a inventario')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#f1f1f1',
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee'
  },
  cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
  },
  category: {
      fontSize: 12,
      color: '#777',
      marginBottom: 4
  },
  price: {
      fontSize: 16,
      color: COLORS.gold,
      fontWeight: 'bold'
  },
  actions: {
      flexDirection: 'row',
      marginTop: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.gold,
  }
});
