import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Slider } from 'react-native-elements';
import Book from "../components/Book";
import ModalDropdown from 'react-native-modal-dropdown';

const HomeScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [booksFromAPI, setBooksFromAPI] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [startYear, setStartYear] = useState(1000);
    const [endYear, setEndYear] = useState(2024);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [searchText, booksFromAPI, selectedLanguage, startYear, endYear]);

    const fetchData = async () => {
        const dataJson = await (await fetch(`https://www.googleapis.com/books/v1/volumes?q=""&startIndex=0&maxResults=40`)).json();
        const tempBooks = [];
        const tempLanguages = new Set();

        for (const item of dataJson.items) {
            const book = {
                id: item.id,
                ...item.volumeInfo,
                language: item.volumeInfo.language || "No specified"
            };
            tempBooks.push(book);
            tempLanguages.add(book.language);
        }
        setBooksFromAPI(tempBooks);
        setLanguages([...tempLanguages]);
    };

    const filterBooks = () => {
        const filtered = booksFromAPI.filter(book => {
            const matchesSearchText = book.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesLanguage = selectedLanguage ? book.language === selectedLanguage : true;
            const publishedYear = new Date(book.publishedDate).getFullYear();
            const matchesYearRange = publishedYear >= startYear && publishedYear <= endYear;
            return matchesSearchText && matchesLanguage && matchesYearRange;
        });
        setFilteredBooks(filtered);
    };

    const onBookPress = (item) => {
        navigation.navigate("Book Details", { book: item });
    };

    const navigateToProfile = () => {
        navigation.navigate("Profile");
    };

    const renderBookItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => onBookPress(item)}>
                <Book item={item} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List of Books</Text>
                <TouchableOpacity onPress={navigateToProfile} style={styles.profileIcon}>
                    <Ionicons name="person-circle" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search a book"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity onPress={filterBooks}>
                    <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.filterBar}>
                <View style={styles.languagePicker}>
                    <Text style={styles.filterLabel}>Book language</Text>
                    <ModalDropdown
                        options={['All', ...languages]}
                        defaultValue="All"
                        onSelect={(index, value) => setSelectedLanguage(value === 'All' ? '' : value)}
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownMenu}
                    />
                </View>
                <View style={styles.sliderContainer}>
                    <Text style={styles.filterLabel}>Published Year</Text>
                    <Text>Start Year: {startYear}</Text>
                    <Slider
                        value={startYear}
                        onValueChange={setStartYear}
                        minimumValue={1000}
                        maximumValue={new Date().getFullYear()}
                        step={1}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="#3F51B5"
                        maximumTrackTintColor="#D3D3D3"
                    />
                    <Text>End Year: {endYear}</Text>
                    <Slider
                        value={endYear}
                        onValueChange={setEndYear}
                        minimumValue={startYear}
                        maximumValue={new Date().getFullYear()}
                        step={1}
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor="#3F51B5"
                        maximumTrackTintColor="#D3D3D3"
                    />
                </View>
            </View>
            <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.bookList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileIcon: {
        padding: 10,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    filterBar: {
        padding: 10,
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 10,
    },
    languagePicker: {
        marginBottom: 20,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
    dropdownMenu: {
        width: '90%',
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'stretch',
    },
    track: {
        height: 10,
        borderRadius: 5,
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: '#3F51B5',
    },
    sliderLabelContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sliderLabel: {
        fontSize: 16,
    },
    bookList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    bookItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 15,
    },
    bookImage: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookAuthors: {
        fontSize: 16,
        color: '#666',
    },
});

export default HomeScreen;
