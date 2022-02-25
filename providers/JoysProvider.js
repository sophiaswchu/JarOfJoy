import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import { Joy } from "../schemas";
import { useAuth } from "./AuthProvider";

const JoysContext = React.createContext(null);

const JoysProvider = ( props ) => {
  const [joys, setJoys] = useState([]);
  const { user } = useAuth();

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    if (user == null) {
      console.error("Null user? Needs to log in!");
      return;
    }

    // Enables offline-first: opens a local realm immediately without waiting 
    // for the download of a synchronized realm to be completed.
    const OpenRealmBehaviorConfiguration = {
      type: 'openImmediately',
    };
    const config = {
      schema: [Joy.schema],
      sync: {
        user: user,
        partitionValue: `${user.id}`,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };

    // open a realm for this particular project and get all Joys
    Realm.open(config).then((realm) => {
      realmRef.current = realm;

      const syncJoys = realm.objects("Joy");
      let sortedJoys = syncJoys.sorted("date");
      setJoys([...sortedJoys]);

      // we observe changes on the Joys, in case Sync informs us of changes
      // started in other devices (or the cloud)
      sortedJoys.addListener(() => {
        console.log("Got new data!");
        setJoys([...sortedJoys]);
      });
    });

    return () => {
      // cleanup function
      closeRealm();
    };
  }, [user]);

  const createJoy = (newJoyDate, newJoyContent) => {
    const realm = realmRef.current;
    realm.write(() => {
      // Create a new joy in the same partition -- that is, using the same user id.
      realm.create(
        "Joy",
        new Joy({
          date: newJoyDate || "New Joy",
          content: newJoyContent || "Joy: ",
          partition: user.id,
        })
      );
    });
  };

  // Define the function for deleting a joy.
  // TO DELETE
  const deleteJoy = (joy) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(joy);
      // after deleting, we get the Joys again and update them
      setJoys([...realm.objects("Joy").sorted("date")]);
    });
  };

  const closeRealm = () => {
    const realm = realmRef.current;
      if (realm) {
        realm.close();
        realmRef.current = null;
        setJoys([]);
      }
  };

  // Render the children within the JoysContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <JoysContext.Provider
      value={{
        createJoy,
        deleteJoy,
        closeRealm,
        joys,
      }}
    >
      {props.children}
    </JoysContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useJoys = () => {
  const joys = useContext(JoysContext);
  if (joys == null) {
    throw new Error("useJoys() called outside of a JoysProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return joys;
};

export { JoysProvider, useJoys };