import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

//Estilos para a página Main
export const Container = styled.View`
  flex: 1;
  padding: 30px;
  border-color: #000000;
`;

export const Form = styled.View`
  flex-direction: row;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-color: #eee;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#999",
})`
  flex: 1;
  height: 40px;
  background: #F0F8FF;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #ccc;
`;

export const SubmitButton = styled(RectButton)`
  justify-content: center;
  align-items: center;
  background: #7159c1;
  border-radius: 4px;
  margin-left: 10px;
  padding: 0 12px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: 20px;
`;

export const Movie = styled.View`

  background-color:rgb(253, 246, 230);  
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  border: 2px dashed #000000; 
  width: 90%;
  align-self: center;
  elevation: 5; 
`;

export const MoviePoster = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 32px;
  background: #eee;
  margin: 10px 0px 20px;
  align-self: center;
  
`;

export const MovieTitle = styled.Text`
   font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

export const MovieSummary = styled.Text.attrs({
  numberOfLines: 2,
})
  `font-size: 13px;
   font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 5px;
  `
;
