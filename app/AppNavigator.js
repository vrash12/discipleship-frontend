// app/AppNavigator.js

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import SplashScreen from './component/SplashScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import AdminDashboard from './component/admin/AdminDashboard';
import UserDashboard from './component/user/UserDashboard';
import Bible from './component/bible/Bible';
import LessonForm from './component/devo/LessonForm';
import LessonManager from './component/devo/LessonManager';
import Settings from './component/user_setting/Settings';
import FaithTestScreen from './component/user/discipleship/FaithTestScreen';
import DiscipleshipDashboard from './component/user/discipleship/DiscipleshipDashboard';
import Lesson1English from './component/user/discipleship/lessonEnglish/Lesson1English';
import Lesson2English from './component/user/discipleship/lessonEnglish/Lesson2English';
import Lesson3English from './component/user/discipleship/lessonEnglish/Lesson3English';
import Lesson4English from './component/user/discipleship/lessonEnglish/Lesson4English';
import Lesson5English from './component/user/discipleship/lessonEnglish/Lesson5English';
import Lesson1Tagalog from './component/user/discipleship/lessonTagalog/Lesson1Tagalog';
import Lesson2Tagalog from './component/user/discipleship/lessonTagalog/Lesson2Tagalog';
import Lesson3Tagalog from './component/user/discipleship/lessonTagalog/Lesson3Tagalog';
import Lesson4Tagalog from './component/user/discipleship/lessonTagalog/Lesson4Tagalog';
import Lesson5Tagalog from './component/user/discipleship/lessonTagalog/Lesson5Tagalog';
import NoteFeature from './component/user/notes/NoteFeature';
import LessonContext from './component/user/discipleship/LessonContext';
import HeadAdminDashboard from './component/head_admin/HeadAdminDashboard';
import ChurchLessons from './component/user/discipleship/ChurchLessons';
import LessonDetail from './component/user/discipleship/LessonDetail';

import QuizTagalog1 from './component/user/discipleship/lessonTagalog/QuizTagalog1';
import QuizTagalog2 from './component/user/discipleship/lessonTagalog/QuizTagalog2';
import QuizTagalog3 from './component/user/discipleship/lessonTagalog/QuizTagalog3';
import QuizTagalog4 from './component/user/discipleship/lessonTagalog/QuizTagalog4';
import QuizTagalog5 from './component/user/discipleship/lessonTagalog/QuizTagalog5';
import QuizEnglish1 from './component/user/discipleship/lessonEnglish/QuizEnglish1';
import QuizEnglish2 from './component/user/discipleship/lessonEnglish/QuizEnglish2';
import QuizEnglish3 from './component/user/discipleship/lessonEnglish/QuizEnglish3';
import QuizEnglish4 from './component/user/discipleship/lessonEnglish/QuizEnglish4';
import QuizEnglish5 from './component/user/discipleship/lessonEnglish/QuizEnglish5';
import AdminFaithTestScreen from './component/admin/AdminFaithTestScreen';
import AdminQuizStatistics from './component/admin/AdminQuizStatistics';
import FilePickerTest from './component/sermon/FilePickerTest';
import DiscipleshipIntroductionScreen from './component/user/DiscipleshipIntriductionScreen';
import AddSermonScreen from './component/sermon/AddSermonScreen';
import ManageUsers from './component/admin/ManageUsers';
import LessonScreen from './component/user/discipleship/LessonScreen';
import LanguageSelection from './component/user/discipleship/LanguageSelection';
import SermonScreen from './component/user/SermonScreen';
import PendingRequestsScreen from './component/admin/PendingRequestsScreen';
import RequestDetailsScreen from './component/admin/RequestDetailsScreen';
import { AuthContext } from './AuthProvider'; 

import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

function AppNavigator() {
  const { authState } = useContext(AuthContext);

  if (authState.isLoading) {
    // Show a loading screen while checking auth state
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState.isLoggedIn ? (
          // User is logged in, navigate to the appropriate dashboard based on role
          authState.userRole === 'ADMIN' ? (
            <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />

              <Stack.Screen name="AdminFaithTestScreen" component={AdminFaithTestScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AdminQuizStatistics" component={AdminQuizStatistics} options={{ headerShown: false }} />
              <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ headerShown: false }} />
              <Stack.Screen name="PendingRequestsScreen" component={PendingRequestsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="RequestDetailsScreen" component={RequestDetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddSermonScreen" component={AddSermonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LessonForm" component={LessonForm} options={{ headerShown: false }} />
            </>
          ) :

          authState.userRole === 'HEAD_ADMIN' ? (
            <Stack.Screen name="HeadAdminDashboard" component={HeadAdminDashboard} options={{ headerShown: false }} />
          )
          
          : (
            <>
              <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
              <Stack.Screen name="Bible" component={Bible} options={{ headerShown: false }} />
            
              <Stack.Screen name="LessonManager" component={LessonManager} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
              <Stack.Screen name="FaithTestScreen" component={FaithTestScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DiscipleshipDashboard" component={DiscipleshipDashboard} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson1English" component={Lesson1English} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson2English" component={Lesson2English} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson3English" component={Lesson3English} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson4English" component={Lesson4English} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson5English" component={Lesson5English} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson1Tagalog" component={Lesson1Tagalog} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson2Tagalog" component={Lesson2Tagalog} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson3Tagalog" component={Lesson3Tagalog} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson4Tagalog" component={Lesson4Tagalog} options={{ headerShown: false }} />
              <Stack.Screen name="Lesson5Tagalog" component={Lesson5Tagalog} options={{ headerShown: false }} />
              <Stack.Screen name="NoteFeature" component={NoteFeature} options={{ headerShown: false }} />

              <Stack.Screen name="ChurchLessons" component={ChurchLessons} options={{ headerShown: false }} />
              <Stack.Screen name="LessonDetail" component={LessonDetail} options={{ headerShown: false }} />
              <Stack.Screen name="QuizTagalog1" component={QuizTagalog1} options={{ headerShown: false }} />
              <Stack.Screen name="QuizTagalog2" component={QuizTagalog2} options={{ headerShown: false }} />
              <Stack.Screen name="QuizTagalog3" component={QuizTagalog3} options={{ headerShown: false }} />
              <Stack.Screen name="QuizTagalog4" component={QuizTagalog4} options={{ headerShown: false }} />
              <Stack.Screen name="QuizTagalog5" component={QuizTagalog5} options={{ headerShown: false }} />
              <Stack.Screen name="QuizEnglish1" component={QuizEnglish1} options={{ headerShown: false }} />
              <Stack.Screen name="QuizEnglish2" component={QuizEnglish2} options={{ headerShown: false }} />
              <Stack.Screen name="QuizEnglish3" component={QuizEnglish3} options={{ headerShown: false }} />
              <Stack.Screen name="QuizEnglish4" component={QuizEnglish4} options={{ headerShown: false }} />
              <Stack.Screen name="QuizEnglish5" component={QuizEnglish5} options={{ headerShown: false }} />

              <Stack.Screen name="FilePickerTest" component={FilePickerTest} options={{ headerShown: false }} />
              <Stack.Screen name="DiscipleshipIntroductionScreen" component={DiscipleshipIntroductionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LessonScreen" component={LessonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SermonScreen" component={SermonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LanguageSelection" component={LanguageSelection} options={{ headerShown: false }} />
              {/* Add other user-specific screens here */}
            </>
          )
        ) : (
          // User is not logged in, show authentication screens
          <>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
            {/* Add other auth screens here */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
