// 세션 데이터를 공유하기 위한 파일
// 실제 구현에서는 데이터베이스를 사용해야 합니다

export interface LessonSession {
  id: string
  lessonId: string
  lessonTitle: string
  date: string
  time: string
  trainerId: string
  memberIds: string[]
  memberNames: string[]
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

// 세션 데이터 (실제로는 데이터베이스에 저장)
export const lessonSessions: LessonSession[] = [
  {
    id: "1",
    lessonId: "1",
    lessonTitle: "요가 개인 레슨",
    date: "2025-03-20",
    time: "10:00-11:00",
    trainerId: "2",
    memberIds: ["1"],
    memberNames: ["홍길동"],
    status: "scheduled",
    notes: "첫 레슨입니다.",
  },
  {
    id: "2",
    lessonId: "2",
    lessonTitle: "PT 개인 레슨",
    date: "2025-03-21",
    time: "15:00-16:00",
    trainerId: "2",
    memberIds: ["2"],
    memberNames: ["김철수"],
    status: "scheduled",
    notes: "",
  },
  {
    id: "3",
    lessonId: "3",
    lessonTitle: "그룹 필라테스",
    date: "2025-03-22",
    time: "19:00-19:50",
    trainerId: "2",
    memberIds: ["1", "2"],
    memberNames: ["홍길동", "김철수"],
    status: "scheduled",
    notes: "첫 그룹 수업입니다.",
  },
  {
    id: "4",
    lessonId: "1",
    lessonTitle: "요가 개인 레슨",
    date: "2025-03-25",
    time: "10:00-11:00",
    trainerId: "2",
    memberIds: ["1"],
    memberNames: ["홍길동"],
    status: "scheduled",
    notes: "두 번째 레슨입니다.",
  },
]

