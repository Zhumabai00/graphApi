import { Button, Form, Input, Space, Spin } from "antd"
import { ChangeEvent, FormEvent, useState } from "react";
import { DELETE_ISSUE, GET_ALL_REPOSITORY, GET_ISSUES, UPDATE_ISSUE } from "../client/queries";
import { useMutation } from "@apollo/client";

interface MyState {
	repositoryId?: string;
	title: string;
	body?: string;
}

const ModifyContent = ({ item }: any) => {
	// console.log(item);

	const [inputValue, setInputValue] = useState<MyState>({
		title: '',
		body: '',
	});
	const [UpdateIssue, { error: issueERR }] = useMutation(UPDATE_ISSUE, {
		onCompleted: () => {
			// After the mutation is completed successfully, refetch the data
		},
	})
	const [DeleteIssue, { error: DeleteERR, loading: loadDelete }] = useMutation(DELETE_ISSUE, {
		refetchQueries: [
			GET_ALL_REPOSITORY,
			GET_ISSUES,
		],
	})
	if (issueERR) return <h1>Errroe...</h1>
	if (loadDelete) return <Spin tip="Deleting" size="large"><div className="content" /></Spin>
	const handleSubmit = (e: FormEvent) => {
		// e.preventDefault();
		if (inputValue.title.trim().length) {
			UpdateIssue({
				variables: {
					issueId: item.id,
					body: inputValue.body,
					title: inputValue.title
				}
			});
			setInputValue({
				title: "",
				body: ""
			});
		}
		console.log('Submitting form with data:', inputValue);
	};


	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputValue((prevData) => ({
			...prevData,
			title: value,
		}));
	};
	const handleInputBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setInputValue((prevData) => ({
			...prevData,
			body: value,
		}));
	};

	return (
		<div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
			<Form onFinish={handleSubmit} name="secondForm" layout="vertical" autoComplete="off">
				<Form.Item name="name2" label="Title" rules={[{ required: true }]}>
					<Input onChange={handleInputChange} value={inputValue.title} placeholder={item.title} />
				</Form.Item>
				<Form.Item name={["user2", "introduction2"]} label="Body">
					<Input.TextArea onChange={handleInputBodyChange} value={inputValue.body} placeholder={item.body} />
				</Form.Item>
				<Form.Item>
					<Space>
						<Button htmlType="submit" onClick={() => DeleteIssue({
							variables: {
								issueId: item.id
							},
						})}>Delete</Button>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</div>
	)
}

export default ModifyContent
