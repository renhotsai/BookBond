import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Book from "../components/Book";
import { Dialog } from "react-native-simple-dialogs";
import SelectDropdown from 'react-native-select-dropdown'
import ISO6391 from "iso-639-1";

//https://blog.openreplay.com/setting-up-google-admob-ads-with-react-native/
// https://medium.com/@bansikhokhani27/how-to-add-google-ads-in-react-native-9a8d3a66fe43

const HomeScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [booksFromAPI, setBooksFromAPI] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [open, setOpen] = useState(false)

    useEffect(() => {
        getLanguages()
        fetchData();
    }, []);

    const getLanguages = () => {
        const languagesFromAPI = ISO6391.getAllCodes()
        const tempLanguages = [{ name: 'All', code: '' }]
        languagesFromAPI.map((lang) => {
            const name = ISO6391.getName(lang)
            const item = {
                name: name,
                code: lang
            }
            tempLanguages.push(item)
        })
        setLanguages(tempLanguages)
    }

    useEffect(() => {
        fetchData();
    }, [searchText, selectedLanguage]);

    const fetchData = async () => {
        let url = `https://www.googleapis.com/books/v1/volumes?q='${searchText}'`
        if (selectedLanguage !== '') {
            url += `&langRestrict=${selectedLanguage}`
        }
        url += `&startIndex=0&maxResults=40`
        const dataJson = await (await fetch(url)).json();
        const tempBooks = [];
        if (dataJson.items) {
            for (const item of dataJson.items) {
                if (item.volumeInfo) {
                    const book = {
                        bookId: item.id,
                        title: item.volumeInfo.title || "No Title",
                        authors: item.volumeInfo.authors || ["Unknown Author"],
                        publishedDate: item.volumeInfo.publishedDate || "No Date",
                        language: item.volumeInfo.language || "No specified",
                        ...item.volumeInfo
                    };
                    tempBooks.push(book);
                }
            }
            setBooksFromAPI(tempBooks);
        }
    };

    const onBookPress = (item) => {
        navigation.navigate("Book Details", { item: item });
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
                <TouchableOpacity onPress={booksFromAPI}>
                    <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Ionicons name="funnel" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Dialog
                visible={open}
                onTouchOutside={() => { setOpen(false) }} >
                <View style={styles.languagePicker}>
                    <Text style={styles.filterLabel}>Select Language</Text>
                    <SelectDropdown
                        data={languages}
                        onSelect={(selectedItem, index) => {
                            if (selectedItem.code === "") {
                                setSelectedLanguage("")
                            } else {
                                setSelectedLanguage(selectedItem.code)
                            }
                            setOpen(false)
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {selectedLanguage ? languages.find(lang => lang.code === selectedLanguage).name : "All"}
                                    </Text>
                                    <MaterialCommunityIcons name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenu}
                    />
                </View>
            </Dialog>
            {(languages && selectedLanguage) &&
                <Text style={{ paddingHorizontal: 20, paddingVertical:10 }}>Language:{languages.find(lang => lang.code === selectedLanguage).name}</Text>
            }
            <FlatList
                data={booksFromAPI}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.bookId}
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
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
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
