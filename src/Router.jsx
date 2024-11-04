/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import Home from './Home';
import Inventario from './components/Inventario';
import Calendario from './components/Calendario';
import Monitor_Clima from './components/Monitor_Clima';

import Login from './firebase-login/Login';
import Register from './firebase-login/Register';
import ForgotPassword from './firebase-login/ForgotPassword';

const Stack = createNativeStackNavigator();

function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#4a9f4d',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft color="#fff" size={24} />
              </TouchableOpacity>
            ) : null
          ),
        })}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Iniciar Sesión', headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: 'Registro', headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: 'Recuperar Contraseña', headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen
          name="Inventario"
          component={Inventario}
          options={{ title: 'Inventario de Granos' }}
        />
        <Stack.Screen
          name="Calendario"
          component={Calendario}
          options={{ title: 'Calendario de Siembra' }}
        />
        <Stack.Screen
          name="Monitor_Clima"
          component={Monitor_Clima}
          options={{ title: 'Monitoreo del Clima' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
