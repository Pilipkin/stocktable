/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
    state = {
        loading: false,
        stock: []
    };

    componentDidMount() {
        this.fetchStock();
        this.fetchInterval = setInterval(this.fetchStock, 15000)
    }

    componentWillUnmount() {
        clearInterval(this.fetchInterval)
    }

    fetchStock = () => (
        this.setState({
            loading: true
        }, () => (
            fetch('http://phisix-api3.appspot.com/stocks.json')
                .then(res => res.json())
                .then(json =>
                    json.stock.map(item => ({
                        name: item.name,
                        amount: item.price.amount,
                        volume: item.volume
                    }))
                )
                .then(stock => {
                    this.setState({
                        loading: false,
                        stock
                    })
                })
                .catch(e => {
                    this.setState({
                        loading: false,
                        error: 'Произошла ошибка'
                    })
                })
            )
         )

    );

    _keyExtractor = (item, index) => index.toString();

    _renderItem = ({item}) => (
        <View style={styles.row}>
            <View style={styles.column}>
                <Text>{item.name}</Text>
            </View>
            <View style={styles.column}>
                <Text>{item.volume}</Text>
            </View>
            <View style={styles.column}>
                <Text>{item.amount}</Text>
            </View>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        {
                            this.state.loading ?
                                <ActivityIndicator size="small" color="#2F6497" /> :
                                null
                        }
                    </View>
                    <TouchableOpacity onPress={() => !this.state.loading ? this.fetchStock() : null}>
                        <Text style={styles.refreshText}>Обновить</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text>Название валюты</Text>
                        </View>
                        <View style={styles.column}>
                            <Text>Цена</Text>
                        </View>
                        <View style={styles.column}>
                            <Text>Количество</Text>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.stock}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    },
    content: {
        height: '90%',
        backgroundColor: '#ffffff',
        paddingHorizontal: '5%',
    },
    header: {
        height: '10%',
        paddingBottom: '2%',
        paddingHorizontal: '5%',
        backgroundColor: '#F5FCFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    refreshText: {
        color: '#2F6497'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    column: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    }
});
