import { Student, Enrolment, students, courses, enrolments } from "./data.js";

// --- A1. The grade report -------------------------------------------------

export function gradeReport(studentId: string): string {
  return enrolments
    .filter((e) => e.studentId === studentId)
    .map((e) => {
      const course = courses.find((c) => c.courseId === e.courseId);
      const grade = e.grade === null ? "not awarded" : e.grade;
      return `${course?.courseId} ${course?.title}: ${grade}`;
    })
    .join("\n");
}

// --- A2. Averaging --------------------------------------------------------

export function averageGrade(studentId: string): number {
  return enrolments
    .filter((e) => e.studentId === studentId && e.grade != null)
    .reduce(
      (sum, enrolment, _index, array) =>
        sum + Number(enrolment.grade) / array.length,
      0,
    );
}

// --- A3. Who is missing a grade ------------------------------------------

export function awaitingGrades(): string[] {
  const studentsWithMissingGrades = enrolments
    .filter((enrolment) => enrolment.grade === null)
    .map((enrolment) => {
      const student = students.find((s) => s.id === enrolment.studentId);
      return student ? student.name : "";
    });
  return Array.from(new Set(studentsWithMissingGrades)).sort();
}

// --- A4. A family of formatters ------------------------------------------

export function formatterFor(
  style: "short" | "long",
): (student: Student) => string {
  if (style === "short") {
    return (student: Student) => student.name;
  } else {
    return (student: Student) =>
      `${student.name} (${student.deptName}), ${student.totCred} credits`;
  }
}

// --- A5. Changing nothing -------------------------------------------------

export function raiseCredits(
  list: Student[],
  deptName: string,
  extra: number,
): Student[] {
  return [...list].map((s) => {
    const cloneStudent = { ...s };
    if (s.deptName === deptName) cloneStudent.totCred += extra;
    return cloneStudent;
  });
}

// Part B - higher-order functions and closures

/** A test on a student. Used by everything below. */
export type Test = (student: Student) => boolean;

// --- B1. The opposite test ------------------------------------------------

export function not(test: Test): Test {
  return (student) => !test(student);
}

// --- B2. One pass, two answers -------------------------------------------

export function partition(list: Student[], test: Test): [Student[], Student[]] {
  const result = list.reduce<[Student[], Student[]]>(
    ([passed, failed], c) => {
      if (test(c)) {
        passed.push(c);
      } else {
        failed.push(c);
      }
      return [passed, failed];
    },
    [[], []],
  );
  return result;
}

// --- B3. Do it once -------------------------------------------------------

export function once(calculation: () => number): () => number {
  let result: null | number = null;

  return () => {
    if (!result) {
      result = calculation();
    }
    return result;
  };
}

// --- B4. All of them ------------------------------------------------------

export function allOf(...tests: Test[]): Test {
  return (student: Student) => tests.every((test) => test(student));
}

export const inDepartment =
  (deptName: string): Test =>
  (student: Student) =>
    student.deptName === deptName;

export const atLeast =
  (credits: number): Test =>
  (student: Student) =>
    student.totCred >= credits;
