import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

export default function ListaRegistros({ propRegistro, onApagar }) {
  return (
    <FlatList
      data={propRegistro}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text>Quantidade: {item.qtd}</Text>
          <Text>Produto: {item.produto}</Text>
          <Text>Valor: {item.valor}</Text>
          <Button
            title="Apagar"
            onPress={() => onApagar(index)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
