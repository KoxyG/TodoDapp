export const TODO_CONTRACT_ADDRESS = "0xE6FE5890155cD85Fe793df52293c5e653cab285b";

export const TODO_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "addTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_todoIndex",
				"type": "uint256"
			}
		],
		"name": "deleteTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_todoIndex",
				"type": "uint256"
			}
		],
		"name": "updateTodoStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_todoIndex",
				"type": "uint256"
			}
		],
		"name": "showTodo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					}
				],
				"internalType": "struct Todo.TodoItem",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "showTodos",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					}
				],
				"internalType": "struct Todo.TodoItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]