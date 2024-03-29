import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { View, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import NetInfo from '@react-native-community/netinfo'

import RootView from '../components/common/RootView'
import NoContentView from "../components/common/NoContentView"
import QuestionView from "../components/QuestionView"
import IconButton from '../components/common/IconButton'
import ToolbarButton from '../components/ToolbarButton'
import { ContentText } from '../components/common/Text'
import InformationCard, { InformationText } from '../components/common/InformationCard'

import Strings from '../constants/Strings'
import Layout from '../constants/Layout'
import { ConstantColors } from '../constants/Colors'
import { EVALUATIONSCREEN } from '../constants/Paths'
import { darkTheme, lightTheme } from '../constants/Colors'
import { fetchQuestions } from '../store/actions/questions'

const layout_list = "list"
const layout_single = "single"

const FormScreen = props => {
	const { navigation, route } = props

	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
	const formUuid = route.params

	const [mode, setMode] = useState(layout_list)
	const [pagingIndex, setPagingIndex] = useState(0)

	const [isLoading, setIsLoading] = useState(false)
	const [hasNoNetwork, setHasNoNetwork] = useState(false)
	const [errorCode, setErrorCode] = useState(0)

	const dispatch = useDispatch()
	const questions = useSelector(state => state.questions.questions)

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={ToolbarButton}>
					<Item key="option-layout" iconName="clipboard-text" title={Strings.form_layout_questions} onPress={layoutChangeHandler} />
				</HeaderButtons>
			)
		})
	}, [navigation])

	useEffect(() => {
		checkAndLoadQuestions()
	}, [checkAndLoadQuestions])

	const checkAndLoadQuestions = useCallback(async () => {
		const netinfo = await NetInfo.fetch()
		if (netinfo.isConnected) {
			setIsLoading(true)
			try {
				await dispatch(fetchQuestions(formUuid))
			} catch (err) {
				console.log(err)
				setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
			}
			setIsLoading(false)
		} else {
			setHasNoNetwork(true)
		}
	}, [dispatch])

	function retryHandler() {
		setErrorCode(0)
		setHasNoNetwork(false)
		checkAndLoadQuestions()
	}

	function inputChangeHandler(question, input, validity) {
		question.input = input
		question.validity = validity
	}

	function layoutChangeHandler() {
		setMode(mode => mode === layout_list ? layout_single : layout_list)
	}

	function getAnswers() {
		const _answers = []
		questions.forEach(q => {
			if (q.input) {
				let input = q.input
				//Add a trailing 0 if needed
				if (q.validator.inputType === "NUMBER" && input.endsWith(".")) {
					input += "0"
				}

				_answers.push({ questionUUID: q.uuid, value: input })
			}
		})
		return _answers
	}

	function questionPagingHandler(toNext) {
		var qNext = toNext ? pagingIndex + 1 : pagingIndex - 1
		const max = questions.length - 1

		if (qNext < 0) { qNext = 0 }
		if (qNext > max) { qNext = max }

		setPagingIndex(qNext)
	}

	function calculateHandler() {
		const indiciesError = []
		const indiciesEmpty = []

		questions.forEach((q, index) => {
			if (q.validity === 'invalid') {
				indiciesError.push(index + 1)
			}
			if (!q.input) {
				indiciesEmpty.push(index + 1)
			}
		})

		//Check if no input was given. Abort request if it is the case.
		if (indiciesEmpty.length === questions.length) {
			Alert.alert(Strings.form_dialog_empty_title, Strings.form_dialog_empty_content,
				[
					{ text: Strings.okay, style: "cancel" },
				],
				{ cancelable: false })
			return
		}

		//Check if there are errors in the answers. Abort request if it is the case.
		if (indiciesError.length > 0) {
			Alert.alert(
				Strings.form_dialog_errors_title,
				Strings.form_dialog_errors_content + ' Fehlerhafte Fragen: ' + indiciesError.join(', '),
				[
					{ text: Strings.okay, style: "cancel" },
				],
				{ cancelable: false })
			return
		}

		//Check if there are empty questions left. The user can decide if the request should continue.
		if (indiciesEmpty.length > 0) {
			Alert.alert(
				Strings.form_dialog_send_unfinished_title,
				Strings.form_dialog_send_unfinished_content + ' Unbeantwortete Fragen: ' + indiciesEmpty.join(', '),
				[
					{ text: Strings.cancel, style: "cancel" },
					{ text: Strings.form_send, onPress: () => gotoEvaluation(), style: "default" }
				],
				{ cancelable: false })
		} else {
			gotoEvaluation(questions)
		}
	}

	function gotoEvaluation() {
		if (!isLoading) {
			props.navigation.navigate(EVALUATIONSCREEN, { formUuid: formUuid, questions: questions, answers: getAnswers() })
		}
	}

	console.log("loading: " + isLoading +  ", network: " + hasNoNetwork + ", error: " + errorCode + ", questions: " + questions.length + ", mode: " + mode + ", page:" + pagingIndex)
	var contentView = null
	if (errorCode !== 0) {
		contentView = <NoContentView
			icon="emoticon-sad-outline"
			onRetry={retryHandler}
			title={Strings.form_loading_error + " (Fehlercode: " + errorCode + ")"} />
	} else if (isLoading) {
		contentView = <NoContentView
			icon="cloud-download"
			loading
			title={Strings.form_loading} />
	} else if (hasNoNetwork && questions.length === 0) {
		contentView = <NoContentView
			icon="cloud-off-outline"
			onRetry={retryHandler}
			title={Strings.form_loading_no_network} />
	} else if (questions.length === 0) {
		contentView = <NoContentView
			icon="emoticon-sad-outline"
			onRetry={retryHandler}
			title={Strings.form_loading_empty} />
	} else {
		var questionContent = null
		const submitButton =
			<View style={styles.submitButton}>
				<IconButton
					type="solid"
					icon="chart-areaspline"
					text={Strings.form_calculate}
					onPress={calculateHandler} />
			</View>
		if (mode === layout_list) {
			const listBottomMargin = <View style={styles.listBottomMargin} />

			const notAllQuestionsAdvice =
				<View style={styles.notAllQuestionsAdvice}>
					<InformationCard title={Strings.form_calculate_at_any_point_title}>
						<InformationText>{Strings.form_calculate_at_any_point_content}</InformationText>
					</InformationCard>
				</View>


			questionContent = (
				<View style={styles.listContainer}>
					{submitButton}
					<FlatList
						data={questions}
						ListFooterComponent={listBottomMargin}
						ListHeaderComponent={notAllQuestionsAdvice}
						removeClippedSubviews={false}
						renderItem={({ item, index }) =>
							<QuestionView
								style={styles.question}
								index={index + 1}
								questionId={item.uuid}
								text={item.text}
								description={item.description}
								prefill={item.input}
								validator={item.validator}
								onInputChanged={(input, validity) => inputChangeHandler(item, input, validity)} />}
						keyExtractor={item => item.uuid}
					/>
				</View>)
		} else if (mode === layout_single) {
			const currentQuestion = questions[pagingIndex]
			const canNavigatePrevious = pagingIndex > 0
			const canNavigateNext = (pagingIndex < (questions.length - 1))

			const pageInfoTextStyle = { color: colorTheme.textPrimaryContrast }

			questionContent = (
				<View style={styles.singleQuestionLayoutContainer}>
					<QuestionView
						questionId={currentQuestion.uuid}
						text={currentQuestion.text}
						description={currentQuestion.description}
						prefill={currentQuestion.input}
						validator={currentQuestion.validator}
						onInputChanged={(input, validity) => inputChangeHandler(currentQuestion, input, validity)}
						index={pagingIndex + 1}
					/>
					<View singleQuestionNavigationContainer>
						<View style={styles.questionPagingRow}>
							<TouchableOpacity
								activeOpacity={0.7}
								disabled={!canNavigatePrevious}
								onPress={() => { questionPagingHandler(false) }}
								style={{ ...styles.pagingButtonBackTouch, backgroundColor: canNavigatePrevious ? colorTheme.primary : ConstantColors.grey }}>
								<View style={styles.pagingButtonBack}>
									<Icon
										name="chevron-left"
										size={24}
										color={colorTheme.textPrimaryContrast}>
									</Icon>
									<ContentText
										numberOfLines={1}
										lineBreakMode="tail"
										ellipsizeMode="tail"
										style={pageInfoTextStyle}>
										{Strings.form_paging_backwards}
									</ContentText>
								</View>
							</TouchableOpacity>
							<View style={{ ...styles.pageInfo, backgroundColor: colorTheme.primary }}>
								<ContentText weight="bold" style={pageInfoTextStyle}>{pagingIndex + 1}</ContentText>
								<ContentText style={pageInfoTextStyle}>{" / " + questions.length}</ContentText>
							</View>
							<TouchableOpacity
								disabled={!canNavigateNext}
								activeOpacity={0.7}
								onPress={() => { questionPagingHandler(true) }}
								style={{ ...styles.pagingButtonNextTouch, backgroundColor: canNavigateNext ? colorTheme.primary : ConstantColors.grey, }}>
								<View style={styles.pagingButtonNext}>
									<ContentText
										numberOfLines={1}
										lineBreakMode="tail"
										ellipsizeMode="tail"
										style={pageInfoTextStyle}>
										{Strings.form_paging_forwards}
									</ContentText>
									<Icon
										name="chevron-right"
										size={24}
										color={colorTheme.textPrimaryContrast}>
									</Icon>
								</View>
							</TouchableOpacity>
						</View>
						{submitButton}
					</View>
				</View>
			)
		}

		contentView =
			<>
				{questionContent}
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset="96">
					<View />
				</KeyboardAvoidingView>
			</>
	}

	return (
		<RootView thin>
			{contentView}
		</RootView>
	)
}

const styles = StyleSheet.create({
	singleQuestionLayoutContainer: {
		flex: 1,
		marginTop: 8,
		marginHorizontal: 8,
		justifyContent: "space-between"
	},
	listContainer: {
		flex: 1,
		marginHorizontal: 8,
		marginTop: 8
	},
	question: {
		marginBottom: 8
	},
	questionPagingRow: {
		flexDirection: "row",
		marginBottom: 2
	},
	pagingButtonBackTouch: {
		padding: 8,
		paddingHorizontal: 16,
		alignItems: 'center',
		borderTopLeftRadius: Layout.borderRadius,
		borderBottomLeftRadius: Layout.borderRadius,
	},
	pagingButtonBack: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	pagingButtonNextTouch: {
		padding: 8,
		paddingHorizontal: 16,
		alignItems: 'center',
		borderTopRightRadius: Layout.borderRadius,
		borderBottomRightRadius: Layout.borderRadius,
	},
	pagingButtonNext: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end"
	},
	pageInfo: {
		flex: 1,
		flexDirection: "row",
		padding: 8,
		alignItems: "center",
		justifyContent: "center",
		borderColor: ConstantColors.white,
		borderLeftWidth: Layout.borderWidth,
		borderRightWidth: Layout.borderWidth,
	},
	submitButton: {
		marginBottom: 8
	},
	listBottomMargin: {
		marginBottom: 8
	},
	notAllQuestionsAdvice: {
		marginBottom: 8
	}
})

export default FormScreen
