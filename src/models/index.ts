import NHMAccountLogs from "./NHMAccountLogs";
import NHMAccounts from "./NHMAccounts";
import Notifications from "./Notifications";
import PlacementTestContents from "./PlacementTestContents";
import PlacementTests from "./PlacementTests";
import RegisteredUsers from "./RegisteredUsers";
import ResourceAssets from "./ResourceAssets";
import StudentLearnJourneys from "./StudentLearnJourneys";
import StudentPlacementTestResults from "./StudentPlacementTestResults";
import StudentPlacementTests from "./StudentPlacementTests";
import StudentUserDeviceTokens from "./StudentUserDeviceTokens";
import StudentUsers from "./StudentUsers";
import StudentUserTrackings from "./StudentUserTrackings";

const nodeEnv = process.env.NODE_ENV;
const isAlter = !!(nodeEnv && ['development', 'test'].includes(nodeEnv));

export default () => Promise.all([
  NHMAccountLogs.sync({ alter: isAlter }),
  NHMAccounts.sync({ alter: isAlter }),
  Notifications.sync({ alter: isAlter }),
  PlacementTestContents.sync({ alter: isAlter }),
  PlacementTests.sync({ alter: isAlter }),
  RegisteredUsers.sync({ alter: isAlter }),
  ResourceAssets.sync({ alter: isAlter }),
  StudentLearnJourneys.sync({ alter: isAlter }),
  StudentPlacementTestResults.sync({ alter: isAlter }),
  StudentPlacementTests.sync({ alter: isAlter }),
  StudentUserDeviceTokens.sync({ alter: isAlter }),
  StudentUsers.sync({ alter: isAlter }),
  StudentUserTrackings.sync({ alter: isAlter }),
]);
