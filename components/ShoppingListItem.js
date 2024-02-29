import {useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';

const ShoppingListItem = ({p}) => {
	const [itemHasBeenBought, setItemHasBeenBought] = useState(false);

	const boughtProduct = () => {
		// do something here
		if (!itemHasBeenBought) {
			setItemHasBeenBought(true);
		} else if (itemHasBeenBought) {
			setItemHasBeenBought(false);
		}
	};

	return (
		<View style={styles.shoppingListProduct}>
			{itemHasBeenBought && <View style={styles.textOverLine}></View>}
			<View style={styles.bothText}>
				<Text style={styles.productName}>{p.name}</Text>
				<Text style={styles.productAmount}>{p.amount}</Text>
			</View>
			<Pressable onPress={() => boughtProduct()} style={styles.boughtButton}>
				<Text>{itemHasBeenBought ? 'Undo' : 'Bought'}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	shoppingListProduct: {
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'space-evenly',
		marginBottom: 10,
	},
	bothText: {flex: 10, flexDirection: 'row', justifyContent: 'space-evenly'},
	productName: {flex: 8, flexWrap: 'wrap'},
	productAmount: {flex: 4, justifyContent: 'flex-start', textAlign: 'left'},
	boughtButton: {
		flex: 2,
		padding: 5,
		backgroundColor: '#00BFFF',
		borderRadius: 2,
		elevation: 5,
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	textOverLine: {
		position: 'absolute',
		top: '50%',
		left: 0,
		width: '78%',
		height: 2,
		flex: 10,
		backgroundColor: '#000000',
		zIndex: 1,
		elevation: 5,
	},
});

export default ShoppingListItem;
