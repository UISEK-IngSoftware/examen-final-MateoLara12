import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonAvatar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText
} from '@ionic/react';
import './Home.css';

// Interfaz de los personajes
interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  image: string;
}

const Home: React.FC = () => {

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET: obtener personajes de la API
  const loadCharacters = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://futuramaapi.com/api/characters',
        {
          params: {
            orderBy: 'id',
            orderByDirection: 'asc',
            page: 1,
            size: 50
          }
        }
      );

      setCharacters(response.data.items);
    } catch (err) {
      setError('No se pudieron cargar los personajes 😢');
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al iniciar
  useEffect(() => {
    loadCharacters();
  }, []);

  // Pull to refresh
  const refresh = async (e: CustomEvent) => {
    await loadCharacters();
    e.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Futurama Characters</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Estado de carga */}
        {loading && (
          <div className="state-container">
            <IonSpinner name="crescent" />
            <IonText>Cargando personajes...</IonText>
          </div>
        )}

        {/* Estado de error */}
        {error && !loading && (
          <div className="state-container error">
            <IonText color="danger">{error}</IonText>
          </div>
        )}

        {/* Estado de vacio */}
        {!loading && !error && characters.length === 0 && (
          <div className="state-container">
            <IonText>No hay personajes para mostrar 📭</IonText>
          </div>
        )}

        {/* Lista de personajes */}
        {!loading && !error && characters.length > 0 && (
          <IonList>
            {characters.map(character => (
              <IonItem key={character.id}>
                <IonAvatar slot="start">
                  <img src={character.image} alt={character.name} />
                </IonAvatar>

                <IonLabel>
                  <h2>{character.name}</h2>
                  <p>Género: {character.gender}</p>
                  <p>Estado: {character.status}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;
