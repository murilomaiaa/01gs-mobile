import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api'

export default function App() {


  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('/repositories').then(res => {
      setRepositories(res.data)
    }).catch(e => {
      console.log(e)
    })
  }, [])

  async function handleLikeRepository(id) {
    // achar o item pelo id (retornar o index)
    // item.likes++
    // colocar o item no array[i]
    const { data: likedRepo } = await api.post(`repositories/${id}/like`)

    const repos = repositories.map(repo => {
      // repo.id === likedRepo.id
      //   ? likedRepo
      //   : repo
      if (repo.id === likedRepo.id) {
        return likedRepo
      }

      return repo
    })
    console.log(repos)
    setRepositories(repos)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>

              <Text style={styles.repository}>{repo.title}</Text>

              <View key={repo.tech} style={styles.techsContainer}>
                {repo.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>{tech}</Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {`${repo.likes} curtida${repo.likes != 1 ? 's' : ''}`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                testID={`like-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>

            </View>
          )}
        />
        {/* ending of flatlist */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});