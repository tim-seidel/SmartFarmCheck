export const SUBMIT_FEEDBACK = 'SUBMIT_FEEDBACK'

export const submitFeedback = (feedback) => {
    return async dispatch => {
        /*
        const response = await fetch('https://pas.coala.disigtal/v1/feedback', {
            headers: {
                'method': 'POST',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(feedback)
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }
        */

       await new Promise(r => setTimeout(r, 500));

        dispatch({
            type: SUBMIT_FEEDBACK, 
            feedback: feedback
        })
    }
}