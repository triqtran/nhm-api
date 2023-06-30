///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////            All Ayotree Models             ////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
export type AyotreeTimezone = {
  __type: string;
  ID: string;
  DisplayName: string;
};

export type AyotreeCampus = {
  CampusID: number;
  CampusName: string;
};

export type AyotreeClassroom = {
  ClassRoomID: number;
  ClassRoomName: string;
};

export type AyotreeCourse = {
  CourseID: string;
  CourseCode: string;
  CourseTitle?: string;
  SchedulingType?: string;
  LearningLevel?: string;
  CourseCategories?: string;
  StartDate?: string;
  EndDate?: string;
  CourseTimeZone?: string;
};

export type AyotreeLesson = {
  LessonID: number;
  LessonDate: Date;
  LessonStartTime: Date;
  Duration: number;
  ClassRoomID: number;
  Comment: string;
};

export type AyotreeUserType =
  | 'admin'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'company';

export type AyotreeStudentStatus = 'Active' | 'Inactive';

export type AyotreeUser = {
  UserID: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  PIN: string;
  Email: string;
  UserType?: AyotreeUserType;
};

export type AyotreeStudent = AyotreeUser & {
  StudentID: number;
  TimeZone: string;
  Title?: string;
  AvataURL?: string;
  MiddleInitail?: string;
  Phone?: string;
  Gender?: string;
  Birthday?: string;
  TaxNumber?: string;
  AdditionalContact?: string;
  Nationality?: string;
  Address1?: string;
  Address2?: string;
  Country?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Course?: string;
  Package?: string;
  Status?: AyotreeStudentStatus;
};

export type AyotreeAvailabilityTeacher = AyotreeStudent & {
  TeacherPIN: string;
  TeacherName: string;
  AvailableFrom: Date | string;
  AvailableTo: Date | string;
};

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// All response types following Ayotree APIs ////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
export type PagingRequest = {
  CurrentPage: number;
  TotalRows: number;
};

interface AyotreeResponse {
  d: {
    type?: string;
    ApiInfo?: {
      biMasterTeacherID?: number;
      biMasterUserID?: number;
      biCampusID?: number;
      Code?: number;
      Status?: string;
      Message?: string;
    };
    Result?: {
      Code?: number;
      Status?: string;
      Message?: string;
    };
    CurrentPage?: number | null;
    TotalPage?: number | null;
    TotalRows?: number | null;
  };
}

// List all timezones by Ayotree platform: empty request - response
export type ListAllTimezonesResponse = {
  d: Array<AyotreeTimezone>;
};

// List all campus: empty request - response
export type ListAllCampusResponse = AyotreeResponse & {
  d: {
    ListCampus?: Array<AyotreeCampus> | null;
  };
};

// List classrooms by campus: request - response
export type ListClassroomByCampusIDRequest = {
  schoolInfo: {
    CampusID: number;
  };
};
export type ListClassroomByCampusIDResponse = AyotreeResponse & {
  d: {
    ClassRoomList?: Array<AyotreeClassroom> | null;
  };
};

// List users by type: request - response
export type ListUsersByTypeRequest = {
  profile: {
    UserType: AyotreeUserType;
    CampusID?: number;
    paging?: PagingRequest;
  };
};
export type ListUsersByTypeResponse = AyotreeResponse & {
  d: {
    userList?: Array<AyotreeUser> | null;
  };
};

// List students by campus: request - response
export type ListStudentsByCampusIDRequest = {
  student: {
    CampusID: number;
    Paging: PagingRequest;
  };
};

export type ListStudentsByCampusIDResponse = AyotreeResponse & {
  d: {
    studentList?: Array<AyotreeStudent> | null;
  };
};

// Get student via student ID: request - response
export type GetStudentViaStudentIDRequest = {
  student: {
    StudentID: number;
    CampusID: number;
  };
};

export type GetStudentViaStudentIDResponse = AyotreeResponse & {
  d: {
    // Array has only 1 element
    studentList?: Array<AyotreeStudent> | null;
  };
};

// List the teachers who is teaching availability schedule: request - response
export type GetTeacherTeachingAvailabilityScheduleRequest = {
  teacher: {
    TeacherPIN: string;
    CampusID: number;
    TimeZone: string;
    AvailabilityInfo: {
      DateStart: string;
      DateEnd: string;
    };
  };
};

export type GetTeacherTeachingAvailabilityScheduleResponse = AyotreeResponse & {
  d: {
    ListAvailability: Array<AyotreeAvailabilityTeacher>;
  };
};

// List courses by campus, timezone and paging: request - response
export type ListCourseByCampusTimezoneRequest = {
  course: {
    CampusID: number;
    TimeZone: string;
    paging?: {
      CurrentPage?: number;
      TotalRows?: number;
    };
  };
};

export type ListCourseByCampusTimezoneResponse = AyotreeResponse & {
  d: {
    CourseList: Array<AyotreeCourse>;
  };
};

// List lessons by campus, course: request - response
export type ListLessonsByCampusTeacherPINRequest = {
  schedule: {
    TeachPIN?: string;
    CampusID: number;
    TimeZone: string;
    courseInfo: {
      courseCode: string;
    };
    lessonInfo?: {
      StartDate?: string;
      EndDate?: string;
    };
  };
};

export type ListLessonsByCampusTeacherPINResponse = AyotreeResponse & {
  d: {
    LessonList: Array<AyotreeLesson> | null;
  };
};
