import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {Button, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import {Asset} from 'expo-asset';
import ShoppingListItem from './components/ShoppingListItem';

//const databaseConnection = SQLite.openDatabase('ShoppingListDatabase.db');

function openDatabaseConnection() {
	return SQLite.openDatabase('ShoppingListDatabase.db');
}

//const databaseConnection = openDatabaseConnection();

export default function App() {
	const [databaseConnection, setDatabaseConnection] = useState(null);
	const [shoppingList, setShoppingList] = useState([]);
	//const [product, setProduct] = useState({name: '', amount: 0});
	const [product, setProduct] = useState({name: '', amount: ''});

	const updateList = () => {
		//console.log('käytiin täällä');
		return databaseConnection.transaction(
			(tx) => {
				return tx.executeSql('SELECT * FROM ShoppingList', [], (_, {rows}) => {
					//console.log(rows);
					return setShoppingList(rows._array);
				});
			},
			(error) => {
				return console.log(error);
			},
			null
		);
	};

	useEffect(() => {
		return setDatabaseConnection(openDatabaseConnection());
	}, []);

	useEffect(() => {
		//console.log(databaseConnection);
		if (!databaseConnection) return;
		return databaseConnection.transaction(
			(tx) => {
				//console.log('hello?');
				return tx.executeSql(
					'CREATE TABLE IF NOT EXISTS ShoppingList (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, amount TEXT)'
				);
			},
			(error) => {
				return console.log(error);
			},
			updateList
		);
	}, [databaseConnection]);

	const onInputChange = (e) => {
		// do something here
		//console.log(e);
		//console.log(e.target);
		//console.log(e.target._internalFiberInstanceHandleDEV.pendingProps.nativeID);
		//console.log(Number.parseInt(e.nativeEvent.text));
		//console.log(typeof Number.parseInt(e.nativeEvent.text));
		//e.target._internalFiberInstanceHandleDEV.pendingProps.nativeID
		const {nativeID} = e.target._internalFiberInstanceHandleDEV.pendingProps;
		const {text} = e.nativeEvent;
		//console.log(nativeID);
		//console.log(text);

		if (!nativeID || !text) return;

		if (nativeID === 'name') {
			return setProduct({...product, [nativeID]: text.charAt(0).toUpperCase() + text.slice(1)});
		} else if (nativeID === 'amount') {
			return setProduct({
				...product,
				[nativeID]: text,
			});
		}

		/*
		if (nativeID === 'name') {
			if (!text || text === '') {
				return setProduct({...product, [nativeID]: ''});
			}
			return setProduct({...product, [nativeID]: text.charAt(0).toUpperCase() + text.slice(1)});
		} else if (nativeID === 'amount') {
			return setProduct({
				...product,
				[nativeID]: text === '' || typeof Number.parseInt(text) !== 'number' ? 0 : Number.parseInt(text),
			});
		}
    */
	};

	const cancelSaveProduct = () => {
		return setProduct({name: '', amount: ''});
	};

	const saveProduct = () => {
		// do something here
		//console.log('save product');
		//if (!product || !product.name || !product.amount || product.amount === 0) return;
		if (!product || !product.name || !product.amount) return;

		databaseConnection.transaction(
			(tx) => {
				//console.log(typeof product.name, typeof product.amount);
				return tx.executeSql('INSERT INTO ShoppingList (name, amount) VALUES (?, ?)', [
					product.name.trim(),
					product.amount.trim(),
				]);
			},
			(error) => {
				return console.log(error);
			},
			updateList
		);

		return setProduct({name: '', amount: ''});
	};

	const clearList = () => {
		//console.log('clear');
		return databaseConnection.transaction(
			(tx) => {
				//console.log('hello');
				return tx.executeSql('DELETE FROM ShoppingList', []);
			},
			(error) => {
				return console.log(error);
			},
			updateList
		);
	};

	//console.log(product);
	//console.log(databaseConnection);
	//console.log(shoppingList);
	//console.log(shoppingList.length);

	return (
		<View style={styles.container}>
			<View style={styles.inputArea}>
				<TextInput
					id='name'
					nativeID='name'
					placeholder='Product name...'
					value={product.name}
					onChange={(e) => onInputChange(e)}
					style={styles.inputs}
				/>
				<TextInput
					id='amount'
					nativeID='amount'
					placeholder='Amount...'
					value={product.amount}
					onChange={(e) => onInputChange(e)}
					keyboardType='numeric'
					style={styles.inputs}
				/>
				<View style={styles.buttonsArea}>
					<Pressable onPress={() => cancelSaveProduct()} style={styles.cancelButton}>
						<Text>Cancel</Text>
					</Pressable>
					<Pressable onPress={() => saveProduct()} style={styles.saveButton}>
						<Text>Save</Text>
					</Pressable>
				</View>
			</View>
			<Text style={styles.shoppingListTitle}>Shopping List</Text>
			{shoppingList && shoppingList.length > 0 ? (
				<View style={styles.shoppingListArea}>
					{shoppingList.map((p, index) => (
						<ShoppingListItem key={index} p={p} />
					))}
					<View style={styles.clearListButtonArea}>
						<Pressable onPress={() => clearList()} style={styles.clearListButton}>
							<Text>Clear list</Text>
						</Pressable>
					</View>
				</View>
			) : (
				<View>
					<Text>Empty...</Text>
				</View>
			)}
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		//margin top Constantin kautta parempi, mutta ei nyt jaksa
		marginTop: 50,
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		//justifyContent: 'center',
	},
	inputArea: {justifyContent: 'space-around'},
	inputs: {width: 300, borderWidth: 1, borderColor: '#000000', paddingLeft: 5, marginBottom: 10},
	buttonsArea: {flexDirection: 'row', justifyContent: 'flex-end'},
	cancelButton: {
		//flex: 1,
		//wdith: 50,
		marginRight: 10,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#00BFFF',
		borderRadius: 2,
		elevation: 5,
		textAlign: 'center',
		textAlignVertical: 'center',
		justifyContent: 'center',
	},
	saveButton: {
		//flex: 1,
		//width: 50,
		padding: 5,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#00BFFF',
		borderRadius: 2,
		elevation: 5,
		textAlign: 'center',
		textAlignVertical: 'center',
		justifyContent: 'center',
	},
	shoppingListTitle: {fontSize: 40},
	shoppingListArea: {width: 300, justifyContent: 'space-between'},
	clearListButtonArea: {flexDirection: 'row', justifyContent: 'flex-end'},
	clearListButton: {
		marginTop: 10,
		padding: 5,
		backgroundColor: '#00BFFF',
		borderRadius: 2,
		elevation: 5,
		textAlign: 'center',
		textAlignVertical: 'center',
		//iOS
		//shadowColor: '#000000',
		//shadowOffset: {width: 5, height: 5},
		//shadowOpacity: 1,
		//shadowRadius: 5,
	},
});

