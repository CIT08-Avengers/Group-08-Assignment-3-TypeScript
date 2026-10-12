// Part B - higher-order functions and closures
//
// Each of these either takes a function, returns one, or both.

import { Student, students } from './data.js';

/** A test on a student. Used by everything below. */
export type Test = (student: Student) => boolean;

// --- B1. The opposite test ------------------------------------------------

/**
 * Takes a test and returns the opposite test:
 *
 *     const inCs = (s: Student) => s.deptName === 'Comp. Sci.';
 *     students.filter(not(inCs));      // everyone else
 *
 * One line is enough, once you see what has to be returned.
 */
export function not(test: Test): Test {
  return (student) => !test(student)
}

// --- B2. One pass, two answers -------------------------------------------

/**
 * Splits a list in two by a test, in one pass: those that pass first, those
 * that fail second.
 *
 *     const [passing, failing] = partition(students, s => s.totCred >= 60);
 *
 * The return type is a tuple, so the two arrays cannot be mixed up, and the
 * caller can take them apart by position.
 */

// Without reduce
// export function partition(list: Student[], test: Test): [Student[], Student[]] {
//   const passed = []
//   const failed = []

//   for (const s of list) {
//     if (test(s)) {
//       passed.push(s)
//     } else {
//       failed.push(s)
//     }
//   }
//   return [passed, failed]
// }

export function partition(list: Student[], test: Test): [Student[], Student[]] {
  const result: [Student[], Student[]] = list.reduce((a, c) => {
    const passed = a[0]
    const failed = a[1]
    
    if (test(c)) {
      passed.push(c)
    } else {
      failed.push(c)
    }

    return [passed, failed]
  },[[] as Student[], [] as Student[]])
  return result
}

// --- B3. Do it once -------------------------------------------------------

/**
 * The parameter is a calculation: a function that takes no arguments and
 * returns a number. Takes such a function and returns a new one that runs
 * it the first time it is called and never again. Every later call hands
 * back the number from the first call, without calculating it again:
 *
 *     let calls = 0;
 *     const count = once(() => { calls++; return students.length; });
 *     count();   // 13, calls is now 1
 *     count();   // 13, calls is still 1
 *
 * Be ready to say where the saved number lives after once has returned.
 */
export function once(calculation: () => number): () => number {
  let result: null | number = null

  return () => {
    if (!result) {
      result = calculation()
    }
    return result
  }
}

// --- B4. All of them ------------------------------------------------------

/**
 * Combines any number of tests into one test that passes only when all of
 * them do:
 *
 *     const senior = allOf(inDepartment('Comp. Sci.'), atLeast(60));
 *
 * The three dots in a parameter list gather the arguments into an array.
 * With no tests at all, everything passes: there is nothing to fail.
 */
export function allOf(...tests: Test[]): Test {  
  return (student) => {
    for (const t of tests) {
      if (!t(student)) return false
    }
    return true
  }
}

// Two small helpers to build tests with, given to you.
export const inDepartment = (deptName: string): Test =>
  (student: Student) => student.deptName === deptName;

export const atLeast = (credits: number): Test =>
  (student: Student) => student.totCred >= credits;
