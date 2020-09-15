import Question from "../../models/Question"
import Validator from "../../models/Validator"
import AsyncStorage from "@react-native-community/async-storage"
import Keys from "../../constants/Keys"

export const SET_QUESTIONS = "SET_QUESTIONS"

export const fetchQuestions = () => {
    return async dispatch => {
        const response = await fetch('https://pas.coala.digital/v1/questions', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        const json = await response.json()
        const questions = []
        json.forEach(q => {
            questions.push(new Question(
                q.uuid,
                q.text,
                q.description,
                new Validator(
                    q.validator.uuid,
                    q.validator.inputType,
                    q.validator.pattern,
                    q.validator.minLength,
                    q.validator.maxLength,
                    q.validator.min,
                    q.validator.max,
                    q.validator.options,
                    q.validator.repeatable,
                    q.validator.unit
                ),
                q.formPriority
            ))
        })

        questions.sort(function (q1, q2) {
            return q1.formPriority - q2.formPriority
        })

        for (var i = 0; i < questions.length; i++) {
            const q = questions[i]
            const value = await AsyncStorage.getItem(Keys.PREFILL_PREFIX + q.uuid)
            q.input = value ?? ''
        }

        dispatch({
            type: SET_QUESTIONS,
            questions: questions ?? []
        })
    }
}
