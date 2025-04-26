import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";


export default class CadastrarUsuario extends Component {
  state = {
    nome: "",
    telefone: "",
    cpf: "",
    curso: "",
    email: "",
    password: "",
    focusedField: "", // Adicionando um campo para identificar qual campo está focado
  };

  // Função para salvar os dados no AsyncStorage
  handleCadastro = async () => {
    const { nome, telefone, cpf, curso, email, password } = this.state;
    if (!nome || !telefone || !cpf || !curso || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      alert("Erro", "Preencha todos os campos!")
      return;
    }
  
    const newUser = { nome, telefone, cpf, curso, email, password };
  
    try {
      // Recupera a lista de usuários salvos
      const usersData = await AsyncStorage.getItem("users");
      let users = usersData ? JSON.parse(usersData) : [];
  
      // Verifica se o email já existe
      const emailExists = users.some((user) => user.email === email);
      if (emailExists) {
        Alert.alert("Erro", "Este e-mail já está cadastrado!");
        alert("Erro", "Este e-mail já está cadastrado!")
        return;
      }
  
      // Adiciona o novo usuário à lista
      users.push(newUser);
  
      // Salva a lista atualizada de usuários no AsyncStorage
      await AsyncStorage.setItem("users", JSON.stringify(users));
  
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      alert("Sucesso", "Usuário cadastrado com sucesso!")
      this.props.navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar os dados!");
      alert("Erro", "Falha ao salvar os dados!")
    }
  };
  
  
  // Função para carregar os dados salvos no AsyncStorage
  carregarDados = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        this.setState(user);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar os dados!");
      alert("Erro", "Falha ao carregar os dados!")
    }
  };

  // Carregar os dados assim que a tela for montada
  componentDidMount() {
    this.carregarDados();
  }
  async componentDidMount() {
    try {
      const userId = await AsyncStorage.getItem("userId"); 
      console.log("Usuário logado:", userId); // Verifique se está retornando um valor correto
  
      if (userId) {
        this.setState({ userId });
  
        // Carregar os favoritos do usuário específico
        const favoriteMovies = await AsyncStorage.getItem(`favoriteMovies_${userId}`);
        console.log("Filmes favoritos carregados:", favoriteMovies);
  
        if (favoriteMovies) {
          this.setState({ favoriteMovies: JSON.parse(favoriteMovies) });
        }
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    }
  }
  
  // Função para atualizar o estado de qual campo está sendo focado
  handleFocus = (field) => {
    this.setState({ focusedField: field });
  };

  handleBlur = () => {
    this.setState({ focusedField: "" });
  };

  render() {
    const { focusedField } = this.state; // Obtendo o estado de qual campo está focado

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro de Usuário</Text>

        <Text style={styles.label}>Nome</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "nome" || this.state.nome !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={this.state.nome}
            onFocus={() => this.handleFocus("nome")}
            onBlur={this.handleBlur}
            onChangeText={(nome) => this.setState({ nome })}
          />
        </View>

        <Text style={styles.label}>Telefone</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "telefone" || this.state.telefone !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            value={this.state.telefone}
            onFocus={() => this.handleFocus("telefone")}
            onBlur={this.handleBlur}
            onChangeText={(telefone) => this.setState({ telefone })}
          />
        </View>

        <Text style={styles.label}>CPF</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "cpf" || this.state.cpf !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite seu CPF"
            keyboardType="numeric"
            value={this.state.cpf}
            onFocus={() => this.handleFocus("cpf")}
            onBlur={this.handleBlur}
            onChangeText={(cpf) => this.setState({ cpf })}
          />
        </View>

        <Text style={styles.label}>Curso</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "curso" || this.state.curso !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite seu curso"
            value={this.state.curso}
            onFocus={() => this.handleFocus("curso")}
            onBlur={this.handleBlur}
            onChangeText={(curso) => this.setState({ curso })}
          />
        </View>

        <Text style={styles.label}>E-mail</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "email" || this.state.email !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={this.state.email}
            onFocus={() => this.handleFocus("email")}
            onBlur={this.handleBlur}
            onChangeText={(email) => this.setState({ email })}
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor:
                focusedField === "password" || this.state.password !== "" ? "#7159c1" : "#ccc",
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry={true}
            value={this.state.password}
            onFocus={() => this.handleFocus("password")}
            onBlur={this.handleBlur}
            onChangeText={(password) => this.setState({ password })}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#7159c1",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  input: {
    fontSize: 16,
    paddingVertical: 5,
  },
  inputContainer: {
    width: "80%",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#7159c1",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});