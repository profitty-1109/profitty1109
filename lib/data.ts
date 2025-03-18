// This file provides mock data and functions for the apartment community app.
// In a real application, this data would be fetched from a database.

// Facilities data
const facilities = [
  {
    id: "1",
    name: "헬스장",
    description: "최신 운동 기구를 갖춘 헬스장입니다.",
    image: "/placeholder.svg?height=200&width=400",
    hours: "06:00 - 22:00",
    location: "커뮤니티 센터 1층",
    status: "open",
    capacity: 30,
    currentUsers: 12,
  },
  {
    id: "2",
    name: "수영장",
    description: "25m 길이의 실내 수영장입니다.",
    image: "/placeholder.svg?height=200&width=400",
    hours: "06:00 - 21:00",
    location: "커뮤니티 센터 지하 1층",
    status: "open",
    capacity: 20,
    currentUsers: 8,
  },
  {
    id: "3",
    name: "골프연습장",
    description: "10타석 규모의 실내 골프연습장입니다.",
    image: "/placeholder.svg?height=200&width=400",
    hours: "08:00 - 22:00",
    location: "커뮤니티 센터 옥상",
    status: "maintenance",
    capacity: 10,
    currentUsers: 0,
  },
  {
    id: "4",
    name: "탁구장",
    description: "4개의 탁구대를 갖춘 탁구장입니다.",
    image: "/placeholder.svg?height=200&width=400",
    hours: "09:00 - 21:00",
    location: "커뮤니티 센터 2층",
    status: "open",
    capacity: 8,
    currentUsers: 4,
  },
]

export async function getFacilities() {
  return facilities
}

export async function getFacilityById(id: string) {
  return facilities.find((facility) => facility.id === id)
}

// Lessons data
const lessons = [
  {
    id: "1",
    title: "요가 클래스",
    description: "초보자를 위한 요가 클래스입니다.",
    trainerId: "1",
    trainerName: "김지연",
    capacity: 10,
    duration: 60,
    location: "커뮤니티 센터 3층",
    schedule: [
      { day: "월", time: "10:00-11:00" },
      { day: "수", time: "19:00-20:00" },
    ],
  },
  {
    id: "2",
    title: "수영 레슨",
    description: "초급 수영 레슨입니다.",
    trainerId: "2",
    trainerName: "박태준",
    capacity: 5,
    duration: 45,
    location: "수영장",
    schedule: [
      { day: "화", time: "15:00-15:45" },
      { day: "목", time: "15:00-15:45" },
    ],
  },
]

export async function getLessons() {
  return lessons
}

// Notices data
const notices = [
  {
    id: "1",
    title: "3월 시설 점검 안내",
    content: "3월 15일에 헬스장 시설 점검이 있을 예정입니다.",
    authorId: "1",
    authorName: "관리자",
    createdAt: "2025-03-10",
    important: true,
  },
  {
    id: "2",
    title: "커뮤니티 센터 운영 시간 변경",
    content: "3월부터 커뮤니티 센터 운영 시간이 변경됩니다.",
    authorId: "1",
    authorName: "관리자",
    createdAt: "2025-03-12",
    important: false,
  },
]

export async function getNotices() {
  return notices
}

export async function createNotice(notice: any) {
  const newNotice = {
    id: Math.random().toString(36).substring(2, 15),
    ...notice,
    createdAt: new Date().toISOString().split("T")[0],
  }
  notices.push(newNotice)
  return newNotice
}

// Reservations data
const reservations = []

// 레슨 예약 데이터 (목업)
let lessonReservations = [
  {
    id: "1",
    lessonId: "1",
    lessonTitle: "요가 클래스",
    userId: "1",
    userName: "홍길동",
    date: "2025-03-20",
    time: "10:00-11:00",
    status: "confirmed",
    createdAt: "2025-03-15",
  },
  {
    id: "2",
    lessonId: "2",
    lessonTitle: "수영 레슨",
    userId: "1",
    userName: "홍길동",
    date: "2025-03-22",
    time: "15:00-15:45",
    status: "confirmed",
    createdAt: "2025-03-16",
  },
  {
    id: "3",
    lessonId: "1",
    lessonTitle: "요가 클래스",
    userId: "1",
    userName: "홍길동",
    date: "2025-03-10",
    time: "19:00-20:00",
    status: "confirmed",
    createdAt: "2025-03-05",
  },
]

export async function getReservationsByUserId(userId: string) {
  try {
    console.log(`데이터 서비스: 사용자 ID ${userId}의 레슨 예약 가져오기 시도`)

    // 사용자 ID에 따라 필터링된 예약 반환
    const userReservations = lessonReservations.filter((reservation) => reservation.userId === userId)

    if (!userReservations || userReservations.length === 0) {
      console.log(`데이터 서비스: 사용자 ID ${userId}의 레슨 예약이 없습니다`)
      return [] // 빈 배열 반환
    }

    console.log(`데이터 서비스: 사용자 ID ${userId}의 레슨 예약 ${userReservations.length}개 반환`)
    return userReservations
  } catch (error) {
    console.error("데이터 서비스 오류 (getReservationsByUserId):", error)
    return [] // 오류 발생 시 빈 배열 반환
  }
}

export async function createReservation(reservation: any) {
  const newReservation = {
    id: Math.random().toString(36).substring(2, 15),
    ...reservation,
    createdAt: new Date().toISOString().split("T")[0],
  }
  lessonReservations.push(newReservation)
  return newReservation
}

export async function cancelReservation(reservationId: string, userId: string) {
  lessonReservations = lessonReservations.map((reservation) => {
    if (reservation.id === reservationId && reservation.userId === userId) {
      return { ...reservation, status: "cancelled" }
    }
    return reservation
  })
  return lessonReservations.find((reservation) => reservation.id === reservationId)
}

// User data (in-memory for now)
const users = [
  {
    id: "1",
    email: "resident@example.com",
    password: "password123",
    name: "홍길동",
    role: "resident",
  },
  {
    id: "2",
    email: "trainer@example.com",
    password: "password123",
    name: "박트레이너",
    role: "trainer",
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password123",
    name: "관리자",
    role: "admin",
  },
]

export async function getUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

// Community posts data
const posts = [
  {
    id: "1",
    title: "커뮤니티 앱 오픈!",
    content: "아파트 커뮤니티 앱이 드디어 오픈했습니다. 많은 이용 부탁드립니다.",
    authorId: "1",
    authorName: "관리자",
    category: "공지",
    createdAt: "2025-03-15",
    comments: [],
  },
  {
    id: "2",
    title: "오늘 저녁 7시 헬스장에서 만나요!",
    content: "오늘 저녁 7시에 헬스장에서 같이 운동하실 분 계신가요?",
    authorId: "2",
    authorName: "김철수",
    category: "모임",
    createdAt: "2025-03-16",
    comments: [],
  },
]

export async function getPosts() {
  return posts
}

export async function createPost(post: any) {
  const newPost = {
    id: Math.random().toString(36).substring(2, 15),
    ...post,
    createdAt: new Date().toISOString().split("T")[0],
    comments: [],
  }
  posts.push(newPost)
  return newPost
}

// Exercise Logs data
let exerciseLogs = []

// 사용자 ID로 운동 일지 가져오기
export async function getExerciseLogsByUserId(userId: string) {
  try {
    // 실제 환경에서는 데이터베이스에서 가져오는 로직
    // 현재는 목업 데이터 반환
    console.log(`데이터 서비스: 사용자 ID ${userId}의 운동 일지 가져오기 시도`)

    // 사용자 ID에 따라 다른 목업 데이터 반환
    const mockLogs = getMockExerciseLogs(userId)

    if (!mockLogs || mockLogs.length === 0) {
      console.log(`데이터 서비스: 사용자 ID ${userId}의 운동 일지가 없습니다`)
      return [] // 빈 배열 반환
    }

    console.log(`데이터 서비스: 사용자 ID ${userId}의 운동 일지 ${mockLogs.length}개 반환`)
    return mockLogs
  } catch (error) {
    console.error("데이터 서비스 오류 (getExerciseLogsByUserId):", error)
    return [] // 오류 발생 시 빈 배열 반환
  }
}

// 목업 운동 일지 데이터
function getMockExerciseLogs(userId: string) {
  // 사용자 ID에 따라 다른 목업 데이터 반환
  // 실제 환경에서는 데이터베이스에서 가져오는 로직으로 대체

  // 기본 목업 데이터 (사용자 ID가 "1"인 경우)
  if (userId === "1") {
    return [
      {
        id: "1",
        userId: "1",
        date: "2025-03-15",
        exerciseType: "헬스",
        duration: 60,
        caloriesBurned: 300,
        notes: "오늘은 상체 운동에 집중했다. 벤치프레스 3세트, 덤벨 프레스 3세트.",
        mood: "good",
        sets: [
          { exercise: "벤치프레스", weight: 70, reps: 10, sets: 3 },
          { exercise: "덤벨 프레스", weight: 20, reps: 12, sets: 3 },
        ],
      },
      {
        id: "2",
        userId: "1",
        date: "2025-03-12",
        exerciseType: "달리기",
        duration: 30,
        caloriesBurned: 250,
        distance: 5,
        notes: "가벼운 조깅으로 시작해서 마지막 1km는 빠르게 달렸다.",
        mood: "great",
      },
      {
        id: "3",
        userId: "1",
        date: "2025-03-10",
        exerciseType: "수영",
        duration: 45,
        caloriesBurned: 400,
        notes: "자유형 위주로 수영했다. 물이 차가워서 조금 힘들었다.",
        mood: "neutral",
      },
      {
        id: "4",
        userId: "1",
        date: "2025-03-05",
        exerciseType: "헬스",
        duration: 70,
        caloriesBurned: 350,
        notes: "하체 운동. 스쿼트, 레그 프레스, 레그 익스텐션.",
        mood: "good",
        sets: [
          { exercise: "스쿼트", weight: 80, reps: 8, sets: 4 },
          { exercise: "레그 프레스", weight: 120, reps: 10, sets: 3 },
          { exercise: "레그 익스텐션", weight: 40, reps: 12, sets: 3 },
        ],
      },
      {
        id: "5",
        userId: "1",
        date: "2025-02-28",
        exerciseType: "요가",
        duration: 50,
        caloriesBurned: 200,
        notes: "스트레칭 위주의 요가. 몸이 많이 뻣뻣했다.",
        mood: "neutral",
      },
      {
        id: "6",
        userId: "1",
        date: "2025-02-25",
        exerciseType: "헬스",
        duration: 65,
        caloriesBurned: 320,
        notes: "등 운동. 랫 풀다운, 로우, 풀업.",
        mood: "good",
        sets: [
          { exercise: "랫 풀다운", weight: 60, reps: 10, sets: 3 },
          { exercise: "시티드 로우", weight: 50, reps: 12, sets: 3 },
          { exercise: "풀업", weight: 0, reps: 8, sets: 3 },
        ],
      },
    ]
  }

  // 다른 사용자 ID에 대한 목업 데이터
  if (userId === "2") {
    return [
      {
        id: "7",
        userId: "2",
        date: "2025-03-14",
        exerciseType: "필라테스",
        duration: 55,
        caloriesBurned: 220,
        notes: "코어 강화 위주의 필라테스. 복부 근육이 많이 자극되었다.",
        mood: "good",
      },
      {
        id: "8",
        userId: "2",
        date: "2025-03-11",
        exerciseType: "사이클",
        duration: 40,
        caloriesBurned: 300,
        distance: 15,
        notes: "실내 사이클링. 인터벌 트레이닝으로 진행했다.",
        mood: "great",
      },
    ]
  }

  // 기본적으로 빈 배열 반환
  return []
}

export async function createExerciseLog(log: any) {
  const newLog = {
    id: Math.random().toString(36).substring(2, 15),
    ...log,
  }
  exerciseLogs.push(newLog)
  return newLog
}

export async function getExerciseLogById(id: string) {
  return exerciseLogs.find((log) => log.id === id)
}

export async function updateExerciseLog(id: string, userId: string, logData: any) {
  exerciseLogs = exerciseLogs.map((log) => {
    if (log.id === id && log.userId === userId) {
      return { ...log, ...logData }
    }
    return log
  })
  return exerciseLogs.find((log) => log.id === id)
}

export async function deleteExerciseLog(id: string, userId: string) {
  exerciseLogs = exerciseLogs.filter((log) => !(log.id === id && log.userId === userId))
  return { success: true }
}

// Facility Reservations data
let facilityReservations = []

export async function createFacilityReservation(reservation: any) {
  const newReservation = {
    id: Math.random().toString(36).substring(2, 15),
    ...reservation,
    createdAt: new Date().toISOString().split("T")[0],
  }
  facilityReservations.push(newReservation)
  return newReservation
}

export async function getFacilityReservationsByUserId(userId: string) {
  return facilityReservations.filter((reservation) => reservation.userId === userId)
}

export async function cancelFacilityReservation(reservationId: string, userId: string) {
  facilityReservations = facilityReservations.map((reservation) => {
    if (reservation.id === reservationId && reservation.userId === userId) {
      return { ...reservation, status: "cancelled" }
    }
    return reservation
  })
  return facilityReservations.find((reservation) => reservation.id === reservationId)
}

export async function getAvailableTimeSlots(facilityId: string, date: string) {
  // This is a placeholder. In a real application, this would query a database
  // to find available time slots for the given facility and date.
  return [
    { timeSlot: "06:00-07:00", available: true, bookedCount: 5, remainingSlots: 25 },
    { timeSlot: "07:00-08:00", available: false, bookedCount: 30, remainingSlots: 0 },
    { timeSlot: "08:00-09:00", available: true, bookedCount: 10, remainingSlots: 20 },
    { timeSlot: "09:00-10:00", available: true, bookedCount: 2, remainingSlots: 28 },
    { timeSlot: "10:00-11:00", available: true, bookedCount: 0, remainingSlots: 30 },
    { timeSlot: "11:00-12:00", available: true, bookedCount: 0, remainingSlots: 30 },
  ]
}

// Trainer related data and functions

let members = [
  {
    id: "1",
    name: "홍길동",
    email: "resident@example.com",
    phone: "010-1234-5678",
    age: 30,
    gender: "남성",
    joinDate: "2024-01-01",
    membershipType: "1개월 회원권",
    membershipExpiry: "2024-01-31",
    trainerId: "2",
    goals: "체중 감량",
    healthInfo: {
      height: 175,
      weight: 80,
      bodyFatPercentage: 25,
      medicalConditions: "없음",
      injuries: "없음",
    },
    notes: "열심히 운동하는 회원",
    attendanceRate: 90,
    progressRate: 80,
  },
  {
    id: "2",
    name: "김철수",
    email: "resident2@example.com",
    phone: "010-1234-5679",
    age: 40,
    gender: "남성",
    joinDate: "2024-02-01",
    membershipType: "3개월 회원권",
    membershipExpiry: "2024-04-30",
    trainerId: "2",
    goals: "근력 향상",
    healthInfo: {
      height: 180,
      weight: 90,
      bodyFatPercentage: 30,
      medicalConditions: "고혈압",
      injuries: "허리 디스크",
    },
    notes: "꾸준히 운동하는 회원",
    attendanceRate: 80,
    progressRate: 70,
  },
]

export async function getMembersByTrainerId(trainerId: string) {
  return members.filter((member) => member.trainerId === trainerId)
}

export async function getMemberById(id: string) {
  return members.find((member) => member.id === id)
}

export async function createMember(member: any) {
  const newMember = {
    id: Math.random().toString(36).substring(2, 15),
    ...member,
  }
  members.push(newMember)
  return newMember
}

export async function updateMember(id: string, memberData: any) {
  members = members.map((member) => {
    if (member.id === id) {
      return { ...member, ...memberData }
    }
    return member
  })
  return members.find((member) => member.id === id)
}

export async function deleteMember(id: string) {
  members = members.filter((member) => member.id !== id)
  return { success: true }
}

let routines = [
  {
    id: "1",
    name: "전신 근력 운동 루틴",
    trainerId: "2",
    targetGroup: "초보자",
    description: "전신 근력을 향상시키기 위한 루틴입니다.",
    duration: 60,
    difficulty: "쉬움",
    category: "근력",
    exercises: [
      { name: "스쿼트", sets: 3, reps: "10회", description: "하체 근력 운동" },
      { name: "푸쉬업", sets: 3, reps: "최대한", description: "상체 근력 운동" },
      { name: "플랭크", sets: 3, reps: "30초", description: "코어 근력 운동" },
    ],
    notes: "매주 3회 반복",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "상체 근력 운동 루틴",
    trainerId: "2",
    targetGroup: "중급자",
    description: "상체 근력을 향상시키기 위한 루틴입니다.",
    duration: 60,
    difficulty: "중간",
    category: "근력",
    exercises: [
      { name: "벤치프레스", sets: 3, reps: "8회", description: "가슴 근력 운동" },
      { name: "숄더프레스", sets: 3, reps: "8회", description: "어깨 근력 운동" },
      { name: "바벨로우", sets: 3, reps: "8회", description: "등 근력 운동" },
    ],
    notes: "매주 3회 반복",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export async function getRoutinesByTrainerId(trainerId: string) {
  return routines.filter((routine) => routine.trainerId === trainerId)
}

export async function getRoutineById(id: string) {
  return routines.find((routine) => routine.id === id)
}

export async function createRoutine(routine: any) {
  const newRoutine = {
    id: Math.random().toString(36).substring(2, 15),
    ...routine,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }
  routines.push(newRoutine)
  return newRoutine
}

export async function updateRoutine(id: string, routineData: any) {
  routines = routines.map((routine) => {
    if (routine.id === id) {
      return { ...routine, ...routineData, updatedAt: new Date().toISOString().split("T")[0] }
    }
    return routine
  })
  return routines.find((routine) => routine.id === id)
}

export async function deleteRoutine(id: string) {
  routines = routines.filter((routine) => routine.id !== id)
  return { success: true }
}

// 트레이너 레슨 데이터 수정 - 더 많은 필드 추가
let trainerLessons = [
  {
    id: "1",
    title: "요가 개인 레슨",
    type: "요가",
    description: "1:1 맞춤형 요가 레슨입니다.",
    duration: 60,
    capacity: 1,
    trainerId: "2",
    schedule: [
      { day: "월", time: "10:00-11:00" },
      { day: "수", time: "15:00-16:00" },
    ],
  },
  {
    id: "2",
    title: "PT 개인 레슨",
    type: "PT",
    description: "체계적인 1:1 PT 레슨입니다.",
    duration: 60,
    capacity: 1,
    trainerId: "2",
    schedule: [
      { day: "화", time: "11:00-12:00" },
      { day: "목", time: "17:00-18:00" },
    ],
  },
  {
    id: "3",
    title: "그룹 필라테스",
    type: "필라테스",
    description: "소규모 그룹 필라테스 수업입니다.",
    duration: 50,
    capacity: 5,
    trainerId: "2",
    schedule: [{ day: "금", time: "19:00-19:50" }],
  },
]

// getTrainerLessonsByTrainerId 함수 개선 - 로깅 추가
export async function getTrainerLessonsByTrainerId(trainerId: string) {
  console.log(`트레이너 ID ${trainerId}의 레슨 조회 중...`)
  const lessons = trainerLessons.filter((lesson) => lesson.trainerId === trainerId)
  console.log(`${lessons.length}개의 레슨 찾음`)
  return lessons
}

export async function getTrainerLessonById(id: string) {
  return trainerLessons.find((lesson) => lesson.id === id)
}

export async function createTrainerLesson(lesson: any) {
  const newLesson = {
    id: Math.random().toString(36).substring(2, 15),
    ...lesson,
  }
  trainerLessons.push(newLesson)
  return newLesson
}

export async function updateTrainerLesson(id: string, lessonData: any) {
  trainerLessons = trainerLessons.map((lesson) => {
    if (lesson.id === id) {
      return { ...lesson, ...lessonData }
    }
    return lesson
  })
  return trainerLessons.find((lesson) => lesson.id === id)
}

export async function deleteTrainerLesson(id: string) {
  trainerLessons = trainerLessons.filter((lesson) => lesson.id !== id)
  return { success: true }
}

export async function getTrainerStatistics(trainerId: string) {
  // This is a placeholder. In a real application, this would query a database
  // to find statistics for the given trainer.
  return {
    totalMembers: 50,
    activeMembers: 40,
    averageAttendanceRate: 85,
    totalRevenue: 1000000,
  }
}

// Facility management functions
export async function createFacility(facilityData: any) {
  // This is a placeholder. In a real application, this would create a facility in the database.
  return {
    id: Math.random().toString(36).substring(2, 15),
    ...facilityData,
    createdAt: new Date().toISOString().split("T")[0],
  }
}

export async function updateFacility(id: string, facilityData: any) {
  // This is a placeholder. In a real application, this would update a facility in the database.
  return {
    id,
    ...facilityData,
    updatedAt: new Date().toISOString().split("T")[0],
  }
}

export async function deleteFacility(id: string) {
  // This is a placeholder. In a real application, this would delete a facility from the database.
  return { success: true }
}

// Survey management functions
export async function getSurveys(id?: string) {
  // This is a placeholder. In a real application, this would query surveys from the database.
  if (id) {
    return {
      id,
      title: "커뮤니티 시설 만족도 조사",
      description: "아파트 커뮤니티 시설에 대한 만족도를 조사합니다.",
      status: "진행 중",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      respondents: 45,
      targetRespondents: 100,
      questions: [
        {
          id: 1,
          type: "radio",
          question: "헬스장 시설에 대해 얼마나 만족하십니까?",
          options: ["매우 불만족", "불만족", "보통", "만족", "매우 만족"],
        },
        {
          id: 2,
          type: "radio",
          question: "수영장 시설에 대해 얼마나 만족하십니까?",
          options: ["매우 불만족", "불만족", "보통", "만족", "매우 만족"],
        },
        {
          id: 3,
          type: "checkbox",
          question: "가장 자주 이용하는 시설을 모두 선택해주세요.",
          options: ["헬스장", "수영장", "골프연습장", "탁구장", "독서실"],
        },
        {
          id: 4,
          type: "text",
          question: "커뮤니티 시설 개선을 위한 제안사항이 있으시면 자유롭게 작성해주세요.",
        },
      ],
    }
  }

  return [
    {
      id: "1",
      title: "커뮤니티 시설 만족도 조사",
      description: "아파트 커뮤니티 시설에 대한 만족도를 조사합니다.",
      status: "진행 중",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      respondents: 45,
      targetRespondents: 100,
    },
    {
      id: "2",
      title: "신규 시설 수요 조사",
      description: "입주민들이 원하는 신규 시설에 대한 수요를 조사합니다.",
      status: "예정",
      startDate: "2025-04-01",
      endDate: "2025-04-15",
      respondents: 0,
      targetRespondents: 100,
    },
    {
      id: "3",
      title: "커뮤니티 앱 사용성 평가",
      description: "커뮤니티 앱의 사용성에 대한 평가를 수집합니다.",
      status: "종료",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      respondents: 78,
      targetRespondents: 100,
    },
  ]
}

export async function getSurveyResults(id: string) {
  // This is a placeholder. In a real application, this would query survey results from the database.
  return {
    id,
    title: "커뮤니티 시설 만족도 조사",
    totalRespondents: 45,
    results: [
      {
        questionId: 1,
        question: "헬스장 시설에 대해 얼마나 만족하십니까?",
        type: "radio",
        answers: [
          { option: "매우 불만족", count: 2, percentage: 4 },
          { option: "불만족", count: 5, percentage: 11 },
          { option: "보통", count: 15, percentage: 33 },
          { option: "만족", count: 18, percentage: 40 },
          { option: "매우 만족", count: 5, percentage: 11 },
        ],
      },
      {
        questionId: 2,
        question: "수영장 시설에 대해 얼마나 만족하십니까?",
        type: "radio",
        answers: [
          { option: "매우 불만족", count: 1, percentage: 2 },
          { option: "불만족", count: 3, percentage: 7 },
          { option: "보통", count: 10, percentage: 22 },
          { option: "만족", count: 20, percentage: 44 },
          { option: "매우 만족", count: 11, percentage: 24 },
        ],
      },
      {
        questionId: 3,
        question: "가장 자주 이용하는 시설을 모두 선택해주세요.",
        type: "checkbox",
        answers: [
          { option: "헬스장", count: 30, percentage: 67 },
          { option: "수영장", count: 25, percentage: 56 },
          { option: "골프연습장", count: 12, percentage: 27 },
          { option: "탁구장", count: 18, percentage: 40 },
          { option: "독서실", count: 8, percentage: 18 },
        ],
      },
      {
        questionId: 4,
        question: "커뮤니티 시설 개선을 위한 제안사항이 있으시면 자유롭게 작성해주세요.",
        type: "text",
        answers: [
          { response: "헬스장 운영 시간을 좀 더 늘려주세요." },
          { response: "수영장 물 온도가 너무 차가워요." },
          { response: "골프연습장 매트를 교체해주세요." },
          { response: "시설 예약 시스템이 더 편리했으면 좋겠습니다." },
          { response: "탁구장 청결 상태가 좋지 않습니다." },
        ],
      },
    ],
  }
}

export async function createSurvey(surveyData: any) {
  // This is a placeholder. In a real application, this would create a survey in the database.
  return {
    id: Math.random().toString(36).substring(2, 15),
    ...surveyData,
    createdAt: new Date().toISOString().split("T")[0],
    respondents: 0,
  }
}

export async function updateSurvey(id: string, surveyData: any) {
  // This is a placeholder. In a real application, this would update a survey in the database.
  return {
    id,
    ...surveyData,
    updatedAt: new Date().toISOString().split("T")[0],
  }
}

export async function deleteSurvey(id: string) {
  // This is a placeholder. In a real application, this would delete a facility from the database.
  return { success: true }
}

// Facility statistics functions
export async function getFacilityStatistics(
  facilityId?: string,
  period?: string,
  startDate?: string,
  endDate?: string,
) {
  // This is a placeholder. In a real application, this would query facility statistics from the database.
  return {
    totalVisits: 3300,
    averageDailyVisits: 110,
    averageStayTime: 68,
    mostPopularFacility: "헬스장",
    facilityUsage: [
      { name: "헬스장", visits: 1250, percentage: 38 },
      { name: "수영장", visits: 980, percentage: 30 },
      { name: "골프연습장", visits: 450, percentage: 14 },
      { name: "탁구장", visits: 620, percentage: 18 },
    ],
    hourlyData: [
      { hour: "06:00", 헬스장: 15, 수영장: 25, 골프연습장: 0, 탁구장: 0 },
      { hour: "08:00", 헬스장: 20, 수영장: 15, 골프연습장: 5, 탁구장: 5 },
      { hour: "10:00", 헬스장: 10, 수영장: 10, 골프연습장: 10, 탁구장: 15 },
      { hour: "12:00", 헬스장: 5, 수영장: 5, 골프연습장: 5, 탁구장: 10 },
      { hour: "14:00", 헬스장: 5, 수영장: 5, 골프연습장: 10, 탁구장: 5 },
      { hour: "16:00", 헬스장: 15, 수영장: 10, 골프연습장: 15, 탁구장: 10 },
      { hour: "18:00", 헬스장: 30, 수영장: 15, 골프연습장: 20, 탁구장: 25 },
      { hour: "20:00", 헬스장: 25, 수영장: 10, 골프연습장: 15, 탁구장: 15 },
      { hour: "22:00", 헬스장: 10, 수영장: 0, 골프연습장: 5, 탁구장: 0 },
    ],
    dailyData: [
      { date: "2025-03-01", 헬스장: 45, 수영장: 30, 골프연습장: 15, 탁구장: 20 },
      { date: "2025-03-02", 헬스장: 50, 수영장: 35, 골프연습장: 10, 탁구장: 25 },
      { date: "2025-03-03", 헬스장: 40, 수영장: 25, 골프연습장: 20, 탁구장: 15 },
      { date: "2025-03-04", 헬스장: 55, 수영장: 40, 골프연습장: 5, 탁구장: 30 },
      { date: "2025-03-05", 헬스장: 60, 수영장: 45, 골프연습장: 0, 탁구장: 35 },
      { date: "2025-03-06", 헬스장: 50, 수영장: 30, 골프연습장: 10, 탁구장: 20 },
      { date: "2025-03-07", 헬스장: 45, 수영장: 25, 골프연습장: 15, 탁구장: 15 },
    ],
  }
}

// Facility issues functions
let facilityIssues = []

export async function getFacilityIssues(facilityId?: string, status?: string) {
  // This is a placeholder. In a real application, this would query facility issues from the database.
  let filteredIssues = facilityIssues

  if (facilityId) {
    filteredIssues = filteredIssues.filter((issue) => issue.facilityId === facilityId)
  }

  if (status) {
    filteredIssues = filteredIssues.filter((issue) => issue.status === status)
  }

  return filteredIssues
}

export async function createFacilityIssue(issueData: any) {
  // This is a placeholder. In a real application, this would create a facility issue in the database.
  const newIssue = {
    id: Math.random().toString(36).substring(2, 15),
    ...issueData,
    reportedAt: new Date().toISOString().split("T")[0],
  }
  facilityIssues.push(newIssue)
  return newIssue
}

export async function updateFacilityIssue(id: string, issueData: any) {
  // This is a placeholder. In a real application, this would update a facility issue in the database.
  facilityIssues = facilityIssues.map((issue) => {
    if (issue.id === id) {
      return { ...issue, ...issueData }
    }
    return issue
  })
  return facilityIssues.find((issue) => issue.id === id)
}

export async function deleteFacilityIssue(id: string) {
  // This is a placeholder. In a real application, this would delete a facility issue from the database.
  facilityIssues = facilityIssues.filter((issue) => issue.id !== id)
  return { success: true }
}

// 기존 데이터 함수들은 유지하고 추가 함수만 작성합니다

// 입주민 프로필 가져오기
export function getResidentProfile(userId: string) {
  // 실제 구현에서는 데이터베이스에서 가져옴
  return {
    id: userId,
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    unit: "101동 1001호",
    moveInDate: "2023-01-15",
    familyMembers: 3,
    interests: ["헬스", "수영", "요가"],
    notificationSettings: {
      email: true,
      push: true,
      sms: false,
      facilityReminder: true,
      lessonReminder: true,
      communityPosts: true,
      notices: true,
    },
  }
}

// 관리자 프로필 가져오기
export function getAdminProfile(userId: string) {
  // 실제 구현에서는 데이터베이스에서 가져옴
  return {
    id: userId,
    name: "관리자",
    email: "admin@example.com",
    phone: "010-9876-5432",
    position: "관리소장",
    department: "관리사무소",
    bio: "천안 불당호반써밋플레이스센터시티 관리사무소 관리소장입니다.",
    notificationSettings: {
      email: true,
      push: true,
      sms: false,
      facilityIssues: true,
      reservationUpdates: true,
      residentRequests: true,
      systemUpdates: true,
    },
  }
}

