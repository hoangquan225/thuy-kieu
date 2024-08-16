import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import ConerImg from './assets/img/corner.f20fce33b13c08c87da0.png';
import LogoImg from './assets/img/logo.png';
import LogoChrismasImg from './assets/img/logo-chrismas.png';
import dayjs from 'dayjs'; // You can use dayjs or simply work with Date objects
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { hotelList, roomTypeList } from './utils/contants';

const { RangePicker } = DatePicker;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVi, setIsVi] = useState(true);
  const [template, setTemplate] = useState(LogoImg);
  const [form] = Form.useForm();
	const reportTemplateRef = useRef(null);

  const [formData, setFormData] = useState({
    employeeName: 'LÊ THỊ THÚY KIỀU (Ms.) Sales Manager',
    employeePhoneNumber: '(+84) 362542001',
    employeeEmail: 'lethuykieu25082001@gmail.com',
    customerName: '',
    customerPhoneNumber: '',
    hotelName: '',
    address: '',
    hotline: '0362542001',
    checkInOut: [null, null],
    password: '',
    roomType: '',
    roomNumber: null,
    customerNumber: null,
    amount: '',
    infoPayment: '',
    note: '',
    language: 'vi',
  });

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue(formData);
    }
  }, [isModalOpen, formData, form]);

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        setFormData(values);
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const exportPDF = () => {
    const input = document.getElementById('divToPrint');
    if (input) 
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
          pdf.save('cf-booking.pdf');
        });
  };

  const exportImage = () => {
    const input = reportTemplateRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // Tạo một liên kết để tải ảnh
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'report-image.png';
        link.click();
      });
    }
  };

  return (
    <div className="App" style={{display: "flex", justifyContent: "space-between"}}>
      <div ref={reportTemplateRef} id="divToPrint" className='main' style={{display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundImage: `url(${template})`}}>
        <div style={{position: "relative"}}>
          <img 
            src={ConerImg}
            alt="logo" 
            style={{"position":"absolute","top":"-10px","right":"-5px","width":"120px","height":"120px","transform":"rotate(180deg)"}}
          />
          <div className='header' style={{"margin": "0 2em"}}>
            <div style={{display: "flex"}}>
              <div style={{color: "#f99d1c", fontSize: "2em", padding: "0.67em 0", fontWeight: "bold"}}>22</div>
              <div style={{color: "#3e78bc", fontSize: "2em", padding: "0.67em 0", fontWeight: "bold"}}>Housing</div>
            </div>
            <div style={{display: "flex", flexDirection: "column", fontSize: ".8em", fontStyle: "italic", lineHeight:" 1.5em" }}>
              <div>{formData.employeeName}</div>
              <div><a href="mailto:" style={{color: "#3e78bc"}}>{formData.employeeEmail}</a></div>
              <div>{formData.employeePhoneNumber}</div>
            </div>
          </div>
          <div className='content' style={{"margin":"0px 2em","display":"grid","gap":"32px","gridTemplateColumns":"1fr 1fr"}}>
            <div style={{"marginTop":"3em"}}>
              <div>
                <div style={{"fontSize":"1.3em", fontWeight: "bold", "whiteSpace":"nowrap","color":"#3e78bc", padding: "1em 0"}}>{isVi ? "Thông tin khách hàng" : "Guest Info"}</div>
                <div style={{"fontSize":"1em", fontWeight: "bold", paddingBottom: "1.3em", "marginLeft":"18px"}}>{isVi ? "Tên" : "Name"}: {formData.customerName}</div>
                <div style={{"fontSize":"1em", fontWeight: "bold", paddingBottom: "1.3em","marginLeft":"18px"}}>{isVi ? "Số điện thoại" : "Phone"}: {formData.customerPhoneNumber}</div>
              </div>
              <div>
                <div style={{"fontSize":"1.3em", fontWeight: "bold", "whiteSpace":"nowrap","color":"#3e78bc", padding: "1em 0"}}>{isVi ? "Thông tin khách sạn" : "Name"}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold"}}>{isVi ? "Tên" : "Name"}: {formData.hotelName}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold"}}>{isVi ? "Địa chỉ" : "Address"}: {formData.address}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold"}}>{isVi ? "Hotline" : "Hotline"}: {formData.hotline}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold"}}>{isVi ? "Check in" : "Check in"}:  {formData.checkInOut[0] ? dayjs(formData.checkInOut[0]).format('DD/MM/YYYY HH:mm') : "" }</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold"}}>{isVi ? "Check out" : "Check out"}: {formData.checkInOut[1] ? dayjs(formData.checkInOut[1]).format('DD/MM/YYYY HH:mm') : ""}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1.3em", fontWeight: "bold", "fontSize":"12px","lineHeight":"12 px","color":"#f99d1c"}}>
                  (WIFI password: {formData.password})
                </div>
              </div>
            </div> 
            <div>
              <div style={{"color":"#ff0000","fontSize":"22px","fontWeight":"bold","textAlign":"center","opacity":"0.7","fontStyle":"italic","whiteSpace":"nowrap", padding: "0.83em 0"}}>{isVi ? "ĐẶT PHÒNG THÀNH CÔNG" : "BOOKING SUCCESSFUL"}</div>
              <table style={{"borderCollapse": "collapse", "width": "100%", "border": "1px solid black", "textAlign": "center", "minWidth": "200px", "height": "80%"}}>
                <tbody>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px", "fontWeight": "bold"}}>{isVi ? "Loại phòng" : "Room Type"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px", "fontWeight": "bold", "color": "#ff0000"}}>
                      {formData.roomType}
                    </td>
                  </tr>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>{isVi ? "Số lượng phòng" : "Number of residents"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>
                      {formData.roomNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>{isVi ? "Số lượng khách" : "Number of guests"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>
                      {formData.customerNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>{isVi ? "Tổng tiền" : "Total Payment	"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>
                      {formData.amount}
                    </td>
                  </tr>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>{isVi ? "Thông tin thanh toán" : "Payment Information"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>
                      {formData.infoPayment}
                    </td>
                  </tr>
                  <tr>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px"}}>{isVi ? "Ghi chú" : "Note"}</td>
                    <td style={{"border": "1px solid black", "width":" 50%", "padding": "10px", "color": "#f99d1c", "fontStyle": "italic", "fontSize": "14px"}}>
                      {formData.note}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {
          isVi 
          ? 
            <div style={{"wordWrap":"break-word","bottom":"-10","lineHeight":"1.2em","margin":"0 0.2em"}}>
              <div style={{"border":"1px solid #65d60b","display":"flex","flexDirection":"column","padding":"0.5em"}}>
                <span style={{ textAlign: "center", fontWeight: "600", marginBottom: "0.5em", }}>Quy định tại khách sạn/căn hộ</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Vui lòng cung cấp ảnh chụp CCCD trước khi nhận phòng. Với người nước ngoài vui lòng cung cấp ảnh chụp Hộ chiếu và Thị thực/Thẻ tạm trú còn hạn.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Dọn dẹp căn hộ nếu tổ chức ăn uống, lẩu, nướng... Nếu không dọn vui lòng nộp phí vệ sinh: 200.000 -&gt; 500.000 (tuỳ mức độ).</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Thực hiện theo nội quy của khu Chung Cư và tuân thủ luật pháp Việt Nam, tự chịu trách nhiệm trước hành vi của mình.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Không ở quá số người quy định: Studio và 1 ngủ ở tối đa 2 người lớn, 2 ngủ ở tối đa 4 người lớn, 3 ngủ ở tối đa 6 người lớn. Chúng tôi có quyền từ chối cho quý khách nhận phòng và không hoàn lại tiền nếu quý khách ở quá số người quy định.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Không sử dụng và tàng chữ chất cấm dưới mọi hình thức. Không tổ chức đánh bạc tại căn hộ. Nếu quý khách vi phạm, chúng tôi sẽ không hoàn lại tiền cọc.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Không mang đồ căn hộ ra ngoài sử dụng, không kê kéo đồ ra khỏi vị trí như sofa, bàn ăn. Nếu vi phạm, chúng tôi sẽ thu phí kê lại đồ đạc tùy theo tình hình thực tế.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Không dùng chăn ga, khăn tắm thay thế trong tủ dự phòng, nếu lôi ra dùng chúng tôi thu phí: 200.000 cho việc giặt là.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Không làm ồn trong khoảng thời gian từ 22h đến 8h sáng hôm sau để tránh ảnh hưởng các căn hộ khác.</span>
              </div>
              <div style={{"border":"1px solid #65d60b","display":"flex","flexDirection":"column","padding":"0.5em"}}>
                <span style={{ textAlign: "center", fontWeight: "600", marginBottom: "0.5em", }}>Chính sách bảo lưu phòng</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Nếu khách Hủy phòng : Sẽ không được nhận lại số tiền đã đặt.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Khách có thể bảo lưu hoặc đổi ngày trước 48h (02 ngày) kể từ ngày check in, Không áp dụng bảo lưu với đoàn từ 03p trở lên.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Đối với khách đoàn : Không hủy ngang (cọc ít nhất 50%)</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Thời gian bảo lưu 1 tháng kể từ ngày lịch check in, bảo lưu hoặc đổi ngày tối đa 01 lần.</span>
              </div>
              <div style={{"textAlign":"center","width":"100%"}}>
                <div style={{"color": "#3e78bc", padding: "1.3em 0", fontWeight: "bold", }}>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!<br /></div>
              </div>
            </div> 
          :
            <div style={{"wordWrap":"break-word","bottom":"-10","lineHeight":"1.2em","margin":"0 0.2em"}}>
              <div style={{"border":"1px solid #65d60b","display":"flex","flexDirection":"column","padding":"0.5em"}}>
                <span style={{textAlign: "center", fontWeight: "600", marginBottom: "0.5em"}}>Hotel/Apartment Regulations</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Please provide a photo of your ID card before checking in. For foreigners, please provide a photo of your Passport and valid Visa/Residence Permit.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Clean up the apartment after organizing meals, hot pot, barbecue, etc. If not cleaned, a hygiene fee of 200,000 VND to 500,000 VND will be charged (depending on the level of cleanliness).</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>✅ Follow the regulations of the Apartment Complex and adhere to the laws of Vietnam, taking responsibility for your actions.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Do not exceed the specified number of occupants: Studios and 1-bedroom units accommodate a maximum of 2 adults, 2-bedroom units accommodate a maximum of 4 adults, and 3-bedroom units accommodate a maximum of 6 adults. We reserve the right to refuse check-in and will not refund if you exceed the specified number of occupants.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Do not use or store prohibited substances in any form. Do not organize gambling in the apartment. If you violate these rules, we will not refund the deposit.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Do not take apartment items outside for personal use. Do not rearrange furniture such as sofas and dining tables. If violated, we will charge a rearrangement fee based on the actual situation.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Do not use spare blankets, sheets, and towels stored in the emergency cabinet. If used, a laundry fee of 200,000 VND will be charged.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>❌ Keep quiet between 22:00 and 8:00 the next morning to avoid disturbing other apartments.</span>
              </div>
              <div style={{"border":"1px solid #65d60b","display":"flex","flexDirection":"column","padding":"0.5em"}}>
                <span style={{textAlign: "center", fontWeight: "600", marginBottom: "0.5em"}}>Room Reservation Policy</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- If the guest cancels the room: The booking amount will not be refunded.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Guests can reserve or change dates 48 hours (02 days) before check-in date. Reservations do not apply to groups of 3 minutes or more.</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- For groups: No cancellation (at least 50% deposit)</span>
                <span style={{"fontSize":".8em","fontStyle":"italic","fontWeight":"500","lineHeight":"1.5em","margin":"0"}}>- Reservation period is 1 month from the scheduled check-in date, reserve or change date maximum 01 time.</span>
              </div>
              <div style={{"textAlign":"center","width":"100%"}}>
                <div style={{"color": "#3e78bc", padding: "1.3em 0", fontWeight: "bold", }}>Thank you for using our service!<br /></div>
              </div>
            </div> 
        }
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "end", gap: "16px", height: "max-content"}}>
        <Button onClick={() => setIsModalOpen(true)}>sửa</Button>
        <Select
          defaultValue={isVi ? "vi" : "en"}
          options={[
            {
              label: "Tiếng Việt",
              value: "vi",
            }, {
              label: "English",
              value: "en",
            }]
          }
          onChange={(value) => setIsVi(value === "vi")}
        />
        <Button onClick={exportPDF}>Xuất PDF</Button>
        <Button onClick={exportImage}>Xuất ảnh</Button>
      </div>

      <Modal maskClosable={false} width={"60%"} title="Nhập thông tin" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          // layout='vertical'
        >
          <h3 style={{borderTop: "1px solid"}}>Nhập thông tin Nhân viên</h3>
          <Form.Item
            label="Tên nhân viên"
            name="employeeName"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại nhân viên"
            name="employeePhoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email nhân viên"
            name="employeeEmail"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input />
          </Form.Item>

          <h3 style={{borderTop: "1px solid"}}>Nhập thông tin khách hàng</h3>
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại khách hàng"
            name="customerPhoneNumber"
          >
            <Input />
          </Form.Item>
          <h3 style={{borderTop: "1px solid"}}>Nhập thông tin booking</h3>
          <Form.Item
            label="Tên khách sạn"
            name="hotelName"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
          >
            <Select 
              options={hotelList.map(hotel => ({ label: `${hotel.name} - ${hotel.address}`, value: hotel.name }))}
              onChange={(value) => {
                const hotel = hotelList.find(hotel => hotel.name === value);
                form.setFieldsValue({ address: hotel?.address });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            label="Hotline"
            name="hotline"
            rules={[{ required: true, message: 'Vui lòng nhập hotline!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Ngày Check-in / Check-out"
            name="checkInOut"
            rules={[{ required: true, message: 'Please select the check-in and check-out dates!' }]}
          >
            <RangePicker showTime  format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          <Form.Item
            label="Wifi Password"
            name="password"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại phòng"
            name="roomType"
            rules={[{ required: true, message: 'Vui lòng nhập loại phòng!' }]}
          >
            <Select 
              options={roomTypeList.map(type => ({ label: type.value, value: type.value }))}
              onChange={(value) => {
                form.setFieldsValue({ roomType: value });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Số lượng phòng"
            name="roomNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng phòng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lượng khách"
            name="customerNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng khách!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tổng tiền"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thông tin thanh toán"
            name="infoPayment"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin thanh toán!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="note"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item 
            label="Template" 
            name="template"
          >
            <Select
              defaultValue={template}
              options={[
                {
                  label: "Normal",
                  value: LogoImg,
                }, {
                  label: "Chrismas",
                  value: LogoChrismasImg,
                }]
              } 
              onChange={(value) => setTemplate(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
