import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddScheduleModal = ({ show, onClose, members, onAddSchedule }) => {
  const [formData, setFormData] = useState({
    day: '',
    cook: '',
    dish: '',
    time: '19:00',
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    onAddSchedule({ ...formData, id: Date.now() });
    onClose();
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setFormData({ ...formData, time: `${hours}:${minutes}` });
    }
  };

  if (!show) return null;

  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Add Cooking Schedule</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.day}
              onValueChange={(value) => setFormData({ ...formData, day: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select Day" value="" />
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.cook}
              onValueChange={(value) => setFormData({ ...formData, cook: value })}
              style={styles.picker}
            >
              <Picker.Item label="Who's cooking?" value="" />
              {members && members.map((member) => (
                <Picker.Item key={member?._id} label={member?.name} value={member?.name} />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Dish name"
            style={styles.input}
            value={formData.dish}
            onChangeText={(text) => setFormData({ ...formData, dish: text })}
          />

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>{formData.time}</Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={new Date(`1970-01-01T${formData.time}:00`)}
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.addBtn}
              disabled={!formData.day || !formData.cook || !formData.dish}
            >
              <Text style={styles.addBtnText}>Add Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 14,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AddScheduleModal;
