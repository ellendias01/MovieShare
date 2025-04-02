import React, { Component } from "react";
import { StyleSheet } from 'react-native';
import { Keyboard, ActivityIndicator, TouchableOpacity, Text, Alert } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import api from "../services/api"; // Ajuste conforme sua estrutura de API
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  Movie,
  MoviePoster,
  MovieTitle,
  MovieSummary,
} from "../styles"; // Ajuste os estilos conforme necessário

export default class Main extends Component {
  state = {
    searchText: "",  // Campo para busca de filmes
    movies: [],  // Armazena filmes retornados da API
    favoriteMovies: [],  // Lista de filmes favoritos salvos localmente
    loading: false,  // Carregando filmes
    noResults: false,  // Flag para quando não houver resultados
    isFavoritesExpanded: false, // Estado para controlar a visibilidade dos favoritos
    userId: null, 
  };

  async componentDidMount() {
    try {
      const userId = await AsyncStorage.getItem("userId");
  
      if (userId) {
        console.log("Usuário logado:", userId);
        this.setState({ userId });
  
        // Carregar os favoritos do usuário logado
        const favoriteMovies = await AsyncStorage.getItem(`favoriteMovies_${userId}`);
        this.setState({ favoriteMovies: favoriteMovies ? JSON.parse(favoriteMovies) : [] });
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    }
  }
  
  

  componentDidUpdate(_, prevState) {
    const { favoriteMovies, userId } = this.state;
  
    if (userId && prevState.favoriteMovies !== favoriteMovies) {
      console.log("Salvadando favoritos para:", userId);
      AsyncStorage.setItem(`favoriteMovies_${userId}`, JSON.stringify(favoriteMovies));
    }
  }
  

  handleSearch = async () => {
    try {
      const { searchText } = this.state;
      this.setState({ loading: true, movies: [] });

      // Realiza a busca inicial dos filmes
      const response = await fetch(`https://www.omdbapi.com/?apikey=c56f9d8f&s=${searchText}`);
      const data = await response.json();

      if (data.Search) {
        // Faz uma nova requisição para cada filme, para pegar os detalhes, incluindo o 'Plot'
        const movieDetailsPromises = data.Search.map(async (movie) => {
          const movieResponse = await fetch(`https://www.omdbapi.com/?apikey=c56f9d8f&i=${movie.imdbID}`);
          const movieData = await movieResponse.json();
          return {
            ...movie,
            Plot: movieData.Plot || 'Descrição não disponível', // Se não houver Plot, exibe mensagem padrão
          };
        });

        // Espera todas as requisições de detalhes dos filmes
        const moviesWithDetails = await Promise.all(movieDetailsPromises);

        this.setState({ movies: moviesWithDetails, noResults: false });
      } else {
        this.setState({ noResults: true });
      }
    } catch (error) {
      alert("Erro ao buscar filmes!");
      this.setState({ loading: false });
    }
  };

  handleAddFavorite = (movie) => {
    
    const { favoriteMovies } = this.state;
    
    // Verificar se o filme já está na lista de favoritos
    const movieExists = favoriteMovies.some((m) => m.imdbID === movie.imdbID);
    if (movieExists) {
      alert("Este filme já está na sua lista de favoritos.");
      return;
    }

    // Adicionar filme à lista de favoritos
    const updatedFavoriteMovies = [...favoriteMovies, movie];
    this.setState({ favoriteMovies: updatedFavoriteMovies }, () => {
      AsyncStorage.setItem(`favoriteMovies_${this.state.userId}`, JSON.stringify(updatedFavoriteMovies));

    });
  };

  handleRemoveFavorite = (movieID) => {
    // Confirmar a exclusão com o usuário
    Alert.alert("Excluir filme", "Tem certeza que deseja excluir este filme da sua lista?", [
      { text: "Cancelar" },
      { text: "Excluir", onPress: () => this.removeMovieFromFavorites(movieID) },
    ]);
  };
  handleToggleFavorites = () => {
    this.setState((prevState) => ({
      isFavoritesExpanded: !prevState.isFavoritesExpanded,
    }));
  };

  removeMovieFromFavorites = (movieID) => {
    const { favoriteMovies } = this.state;
    const updatedFavoriteMovies = favoriteMovies.filter((movie) => movie.imdbID !== movieID);
    this.setState({ favoriteMovies: updatedFavoriteMovies }, () => {
      AsyncStorage.setItem("favoriteMovies", JSON.stringify(updatedFavoriteMovies));
    });
  };

  render() {
    const { movies, favoriteMovies, loading, searchText, noResults } = this.state;

    return (
      <Container style={{ backgroundColor: this.state.isFavoritesExpanded ? '#E6E6FA' : '#F5FFFA' }}>

        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Buscar filmes"
            value={searchText}
            onChangeText={(text) => this.setState({ searchText: text })}
            returnKeyType="search"
            onSubmitEditing={this.handleSearch}
          />
          <SubmitButton loading={loading} onPress={this.handleSearch}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="search" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        {noResults ? (
          <Text>Não foram encontrados filmes!</Text>
        ) : (
          <List
            showsVerticalScrollIndicator={false}
            data={movies}
            keyExtractor={(movie) => movie.imdbID}
            renderItem={({ item }) => (
              <Movie>
                <MoviePoster source={{ uri: item.Poster }} />
                <MovieTitle>{item.Title}</MovieTitle>
                <MovieSummary>{item.Plot}</MovieSummary>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("MovieDetails", {
                      movieID: item.imdbID,  // Enviar o ID correto
                    });
                  }}
                  style={styles.button}  // Estilo para o botão
                >
                  <Text style={styles.buttonText}>Ver detalhes</Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.handleAddFavorite(item)} style={styles.button1}>
                  <Text style={styles.buttonText}>Adicionar aos favoritos</Text>
                </TouchableOpacity>


              </Movie>
            )}
          />
        )}

        {this.state.isFavoritesExpanded ? (
  <List style={{ height: '100000%'}}
    showsVerticalScrollIndicator={false}
    data={favoriteMovies}
    keyExtractor={(movie) => movie.imdbID}
    
    renderItem={({ item }) => (
      <Movie>
        <MoviePoster source={{ uri: item.Poster }} />
        <MovieTitle>{item.Title}</MovieTitle>
        <MovieSummary>{item.Plot}</MovieSummary>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("MovieDetails", {
              movieID: item.imdbID,
            });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ver detalhes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.handleRemoveFavorite(item.imdbID)}
          style={styles.button2}
        >
          <Text style={styles.buttonText}>Remover dos favoritos</Text>
        </TouchableOpacity>
      </Movie>
    )}
  />
) : (
  <Text></Text>
)}

<TouchableOpacity onPress={this.handleToggleFavorites} style={styles.toggleButton}>
  <Text style={styles.toggleButtonText}>
    {this.state.isFavoritesExpanded ? 'Minimizar favoritos' : 'Ver favoritos'}
  </Text>
</TouchableOpacity>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E90FF', // cor de fundo do botão
    paddingVertical: 5,         // preenchimento vertical
    paddingHorizontal: 5,      // preenchimento horizontal
    marginTop:10,           // espaço entre os botões
    marginBottom: 1,           // espaço entre os botões
    borderRadius: 5,            // borda arredondada
    alignItems: 'center',  
    gap: 10,     // centraliza o texto dentro do botão
  },
  button1: {
    backgroundColor: '#008080', // cor de fundo do botão
    paddingVertical: 5,         // preenchimento vertical
    paddingHorizontal: 5,      // preenchimento horizontal
    marginTop:10,           // espaço entre os botões
    marginBottom: 1,           // espaço entre os botões
    borderRadius: 5,            // borda arredondada
    alignItems: 'center',  
    gap: 10,     // centraliza o texto dentro do botão
  },
  button2: {
    backgroundColor: '#8B0000', // cor de fundo do botão
    paddingVertical: 5,         // preenchimento vertical
    paddingHorizontal: 5,      // preenchimento horizontal
    marginTop:10,           // espaço entre os botões
    marginBottom: 1,           // espaço entre os botões
    borderRadius: 5,            // borda arredondada
    alignItems: 'center',  
    gap: 10,     // centraliza o texto dentro do botão
  },
  buttonText: {
    color: '#F5F5F5',              // cor do texto
    fontSize: 13,                // tamanho da fonte
    fontWeight: 'bold',          // peso da fonte
  },

  toggleButton: {
    backgroundColor: '#f5a623',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },

  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

