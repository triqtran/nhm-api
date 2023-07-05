import GameExercises from './GameExercises';
import GameExerciseDetails from './GameExerciseDetails';
import GameExerciseResults from './GameExerciseResults';
import NHMAccountLogs from './NHMAccountLogs';
import NHMAccounts from './NHMAccounts';
import Notifications from './Notifications';
import ResourceAssets from './ResourceAssets';
import StudentDevices from './StudentDevices';
import StudentJourneys from './StudentJourneys';
import StudentNotifictions from './StudentNotifications';
import Students from './Students';
import StudentTrackings from './StudentTrackings';
import Courses from './Courses';
import Campus from './Campus';
import Lessons from './Lessons';
import VocabularyBook from './VocabularyBook';
import VocabularyBookStudent from './VocabularyBookStudents';

const nodeEnv = process.env.NODE_ENV;
const isAlter = !!(nodeEnv && ['development', 'test'].includes(nodeEnv));

export default () =>
  Promise.all([
    GameExercises.sync({ alter: isAlter }),
    GameExerciseDetails.sync({ alter: isAlter }),
    GameExerciseResults.sync({ alter: isAlter }),
    NHMAccountLogs.sync({ alter: isAlter }),
    NHMAccounts.sync({ alter: isAlter }),
    Notifications.sync({ alter: isAlter }),
    ResourceAssets.sync({ alter: isAlter }),
    StudentDevices.sync({ alter: isAlter }),
    StudentJourneys.sync({ alter: isAlter }),
    StudentNotifictions.sync({ alter: isAlter }),
    Students.sync({ alter: isAlter }),
    StudentTrackings.sync({ alter: isAlter }),
    Courses.sync({ alter: isAlter }),
    Campus.sync({ alter: isAlter }),
    Lessons.sync({ alter: isAlter }),
    VocabularyBook.sync({ alter: isAlter }),
    VocabularyBookStudent.sync({ alter: isAlter }),
  ]);
