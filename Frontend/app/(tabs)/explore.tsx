import React ,{ useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,Modal ,StyleSheet } from 'react-native';

import React ,{ useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity,Modal ,StyleSheet } from 'react-native';


interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioButton} onPress={onPress}>
    <View style={[styles.radioCircle, selected && styles.selectedRadioCircle]} />
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

//Modal's visiblility control
export default function SettingsScreen() {
const [modalVisible, setModalVisible] = useState(false);
const [secondModalVisible, setSecondModalVisible] = useState(false);
const [userModalVisible, setUserModalVisible] = useState(false);
const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
const [selectedTransportOptions, setSelectedTransportOptions] = useState<string[]>([]);
const [userSettingsVisible, setUserSettingsVisible] = useState(false);

//userData
const [username, setUsername] = useState("");
const [userPassword, setPassword] = useState("");
const [response, setResponse] = useState(null);

//POST API
const handleSubmit = ()=>{
  fetch('http://127.0.0.1:8000/Users',{
    method:'POST',
    body:JSON.stringify({
      userAccount:username,
      password:userPassword,
    }),
    redirect:'follow',
  })
  .then((response)=>{
    if(response.redirected){
      window.location.href = response.url;
    }
    else{
      return response.json();
    }
  })
  .then((data)=>setResponse(data))
  .catch((error)=>console.error('Error:',error));
}

//GET API
const handleGet = ()=>{
  fetch('http://127.0.0.1:8000/Users?id=1',{
    method:'GET',
    headers:{
      'Content-Type':'application/json',
    },
    redirect:'follow',
  })
  .then((response)=>{
    if(response.redirected){
      window.location.href = response.url;
    }
    else{
      return response.json();
    }
  })
  .then((data)=>setResponse(data))
  .catch((error)=>console.error('Error:',error));
}

const toggleOption = (option: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
  setSelected((prevSelectedOptions) =>
    prevSelectedOptions.includes(option)
      ? prevSelectedOptions.filter((item) => item !== option)
      : [...prevSelectedOptions, option]
  );
};

  useEffect(()=>{
    if(userModalVisible){
      handleGet();
    }
  },[userModalVisible]);
const [modalVisible, setModalVisible] = useState(false);
const [secondModalVisible, setSecondModalVisible] = useState(false);
const [userModalVisible, setUserModalVisible] = useState(false);
const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
const [selectedTransportOptions, setSelectedTransportOptions] = useState<string[]>([]);
const [userSettingsVisible, setUserSettingsVisible] = useState(false);

//userData
const [username, setUsername] = useState("");
const [userPassword, setPassword] = useState("");
const [response, setResponse] = useState(null);

//POST API
const handleSubmit = ()=>{
  fetch('http://127.0.0.1:8000/Users',{
    method:'POST',
    body:JSON.stringify({
      userAccount:username,
      password:userPassword,
    }),
    redirect:'follow',
  })
  .then((response)=>{
    if(response.redirected){
      window.location.href = response.url;
    }
    else{
      return response.json();
    }
  })
  .then((data)=>setResponse(data))
  .catch((error)=>console.error('Error:',error));
}

//GET API
const handleGet = ()=>{
  fetch('http://127.0.0.1:8000/Users?id=1',{
    method:'GET',
    headers:{
      'Content-Type':'application/json',
    },
    redirect:'follow',
  })
  .then((response)=>{
    if(response.redirected){
      window.location.href = response.url;
    }
    else{
      return response.json();
    }
  })
  .then((data)=>setResponse(data))
  .catch((error)=>console.error('Error:',error));
}

const toggleOption = (option: string, setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
  setSelected((prevSelectedOptions) =>
    prevSelectedOptions.includes(option)
      ? prevSelectedOptions.filter((item) => item !== option)
      : [...prevSelectedOptions, option]
  );
};

  useEffect(()=>{
    if(userModalVisible){
      handleGet();
    }
  },[userModalVisible]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>設定</Text>
        <View>
          <TouchableOpacity style = {styles.avatar} onPress={()=>setUserModalVisible(true)}></TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style = {styles.avatar} onPress={()=>setUserModalVisible(true)}></TouchableOpacity>
        </View>
      </View>

      {/* 天氣偏好區塊 */}
      <View style={styles.preferenceBox}>
        <Text style={styles.boxTitle}>天氣偏好</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>溫度偏好:</Text>
          <TextInput style={styles.input} placeholder="輸入溫度(°C)" />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>濕度偏好:</Text>
          <TextInput style={styles.input} placeholder="輸入濕度" />
        </View>
      </View>

      {/* 活動偏好區塊 */}
      <View style={styles.preferenceBox}>
        <Text style={styles.boxTitle}>活動偏好</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>運動偏好:</Text>
          <TouchableOpacity style = {styles.interactButton} onPress={()=>setModalVisible(true)}>
            <Text style ={styles.interactText}>選擇運動</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>興趣偏好:</Text>
          <TouchableOpacity style = {styles.interactButton} onPress={()=>setSecondModalVisible(true)}>
            <Text style ={styles.interactText}>選擇嗜好</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*選擇運動Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>選擇運動</Text>
            <View style={styles.radioGroup}>
              {['籃球', '羽球', '排球', '游泳', '桌球', '慢跑','公路車'].map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedOptions.includes(option)}
                  onPress={() => toggleOption(option, setSelectedOptions)}
                />
              ))}
              {['籃球', '羽球', '排球', '游泳', '桌球', '慢跑','公路車'].map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedOptions.includes(option)}
                  onPress={() => toggleOption(option, setSelectedOptions)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*選擇嗜好Modal*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => {
          setSecondModalVisible(!secondModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>選擇嗜好</Text>
            <View style={styles.radioGroup}>
              {['做甜點', '健行', '登山', '玩遊戲', '出遊', '閱讀'].map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedTransportOptions.includes(option)}
                  onPress={() => toggleOption(option, setSelectedTransportOptions)}
                />
              ))}
              {['做甜點', '健行', '登山', '玩遊戲', '出遊', '閱讀'].map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedTransportOptions.includes(option)}
                  onPress={() => toggleOption(option, setSelectedTransportOptions)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={[styles.modalbutton, styles.modalbuttonClose]}
              onPress={() => setSecondModalVisible(!secondModalVisible)}>
              onPress={() => setSecondModalVisible(!secondModalVisible)}>
              <Text style={styles.textStyle}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>

        {/*使用者顯示modal*/}
        <Modal
        animationType="fade"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={() => {
          setUserModalVisible(!userModalVisible);
        }}>
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.modalText}>使用者</Text>
              <View style={{gap : 10}}>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者名稱:</Text>
                  <Text style = {styles.label}>{username}</Text>
                </View>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者密碼:</Text>
                  <Text style = {styles.label}>{userPassword}</Text>
                </View>
              </View>
              <TouchableOpacity
              style = {[styles.modalbutton,styles.modalbuttonClose]}
              onPress = {()=>setUserSettingsVisible(!userSettingsVisible)}>
                <Text style = {styles.textStyle}>註冊帳號</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]} 
              onPress = {()=>setUserModalVisible(!userModalVisible)}>
                <Text style = {styles.textStyle}>關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/*使用者設定modal*/}
        <Modal
        animationType="fade"
        transparent={true}
        visible={userSettingsVisible}
        onRequestClose={() => {
          setUserSettingsVisible(!userSettingsVisible);
        }}>
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.modalText}>使用者</Text>
              <View style={{gap : 10}}>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者名稱:</Text>
                  <TextInput style = {styles.input} 
                  placeholder = "輸入名稱"
                  value={username}
                  onChangeText={setUsername}
                  />
                </View>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者密碼:</Text>
                  <TextInput style = {styles.input} 
                  placeholder = "輸入密碼"
                  secureTextEntry = {true}
                  value={userPassword}
                  onChangeText={setPassword}
                  />
                </View>
              </View>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]}
              onPress = {()=>handleSubmit()}>
                <Text style = {styles.textStyle}>提交</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]} 
              onPress = {()=>setUserSettingsVisible(!userSettingsVisible)}>
                <Text style = {styles.textStyle}>關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>

        {/*使用者顯示modal*/}
        <Modal
        animationType="fade"
        transparent={true}
        visible={userModalVisible}
        onRequestClose={() => {
          setUserModalVisible(!userModalVisible);
        }}>
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.modalText}>使用者</Text>
              <View style={{gap : 10}}>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者名稱:</Text>
                  <Text style = {styles.label}>{username}</Text>
                </View>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者密碼:</Text>
                  <Text style = {styles.label}>{userPassword}</Text>
                </View>
              </View>
              <TouchableOpacity
              style = {[styles.modalbutton,styles.modalbuttonClose]}
              onPress = {()=>setUserSettingsVisible(!userSettingsVisible)}>
                <Text style = {styles.textStyle}>註冊帳號</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]} 
              onPress = {()=>setUserModalVisible(!userModalVisible)}>
                <Text style = {styles.textStyle}>關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/*使用者設定modal*/}
        <Modal
        animationType="fade"
        transparent={true}
        visible={userSettingsVisible}
        onRequestClose={() => {
          setUserSettingsVisible(!userSettingsVisible);
        }}>
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.modalText}>使用者</Text>
              <View style={{gap : 10}}>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者名稱:</Text>
                  <TextInput style = {styles.input} 
                  placeholder = "輸入名稱"
                  value={username}
                  onChangeText={setUsername}
                  />
                </View>
                <View style = {styles.inputRow}>
                  <Text style = {styles.label}>使用者密碼:</Text>
                  <TextInput style = {styles.input} 
                  placeholder = "輸入密碼"
                  secureTextEntry = {true}
                  value={userPassword}
                  onChangeText={setPassword}
                  />
                </View>
              </View>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]}
              onPress = {()=>handleSubmit()}>
                <Text style = {styles.textStyle}>提交</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style = {[styles.modalbutton,styles.modalbuttonClose]} 
              onPress = {()=>setUserSettingsVisible(!userSettingsVisible)}>
                <Text style = {styles.textStyle}>關閉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#1a2738',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  userIcon:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  preferenceBox: {
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    gap: 10,
    padding: 15,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    width: "auto",
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  interactButton:{
    backgroundColor:'#4f8ef7',
    flex:1,
    borderRadius:5,
    alignItems:"center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  interactText:{
    color:"#fff",
    fontSize:18,
    fontWeight:"bold",
    alignContent:"center",
  },centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalbutton: {
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: 'center',
    padding: 10,
  },
  modalbuttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  radioButton: { 
    flexDirection: 'row',
    alignItems: 'center', 
    margin: 10, 
  },
  radioCircle: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: 'gray', 
    marginRight: 10, 
  },
  selectedRadioCircle: {
     backgroundColor: 'blue'
 },
  radioLabel: { 
    fontSize: 16 
  },
  radioGroup: {
     flexDirection: 'row', 
     flexWrap: 'wrap', 
     justifyContent: 'space-around', 
     flexDirection: 'row', 
     flexWrap: 'wrap', 
     justifyContent: 'space-around', 
  },
});

