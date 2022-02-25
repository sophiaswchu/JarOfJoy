import React, { useState, useEffect } from "react";
import { TextInput, Button, Linking } from "react-native";
import { useJoys } from "../providers/JoysProvider";
import { useNavigation } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../stylesheet";
import { Logout } from "../components/Logout";

export function JoysView() {
  const navigation = useNavigation();
  // controls the accordion
  const [expanded, setExpanded] = useState(false);

  // State to read data for a new Joy
  const [joyDate, setDate] = useState("");
  const [joyContent, setContent] = useState("");

  const { joys, createJoy, deleteJoy, closeRealm } = useJoys();

  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerBackTitle: "Log out",
        headerLeft: () => <Logout closeRealm={closeRealm} />
    });
  }, [navigation]);

  useEffect(() => {
    
      console.log(JSON.stringify( joys, null, 2));

  
  }); 

  return (
    <ScrollView>
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>Create new Joy</ListItem.Title>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
      {
        <>
          <TextInput
            style={styles.input}
            onChangeText={setDate}
            placeholder="Date"
            value={joyDate}
          />
          <TextInput
            style={styles.input}
            onChangeText={setContent}
            placeholder="Content"
            value={joyContent}
          />
          <Button
                title='Add Joy!'
                color='red'
                onPress={ () => { createJoy(joyDate, joyContent); }}
                />
        </>
      }
      </ListItem.Accordion>
        

      {joys.map((joy, index) =>
        <ListItem.Swipeable
          bottomDivider
          key={index} 
          rightContent={
            <Button
              title="Delete"
              onPress={() => deleteJoy(joy)}
            />
            }
        >
          <ListItem.Content>
            <ListItem.Title>
              {joy.date}
            </ListItem.Title>
            <ListItem.Subtitle>
              {joy.content}
            </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
      )}
    </ScrollView>
  );
}
