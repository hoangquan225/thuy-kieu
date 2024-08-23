import React, { useContext, useEffect, useRef, useState } from 'react';
import '../App.css';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Table } from 'antd';
import ConerImg from '../assets/img/corner.f20fce33b13c08c87da0.png';
import LogoImg from '../assets/img/logo.png';
import LogoChrismasImg from '../assets/img/logo-chrismas.png';
import dayjs from 'dayjs'; // You can use dayjs or simply work with Date objects
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { hotelList, roomTypeList } from '../utils/contants';

const { RangePicker } = DatePicker;

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  roomType: any;
  roomNumber: any;
  customerNumber: any;
  amount: any;
}

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

const TemplateSecond = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      roomType: 'Quân',
      roomNumber: '1',
      customerNumber: '1',
      amount: 1000000
    }
  ]);

  const [count, setCount] = useState(2);
	const reportTemplateRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVi, setIsVi] = useState(true);
  const [template, setTemplate] = useState(LogoImg);
  const [form1] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState<any>("note");

  const [formData, setFormData] = useState({
    employeeName: 'LÊ THỊ THÚY KIỀU (Ms.) Sales Manager',
    employeePhoneNumber: '(+84) 362542001',
    employeeEmail: 'lethuykieu25082001@gmail.com',
    customerName: '',
    customerPhoneNumber: '',
    hotelName: '',
    address: '',
    hotelNameV2: '',
    addressV2: '',
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
      form1.setFieldsValue(formData);
    }
  }, [isModalOpen, formData, form1]);

  const handleOk = () => {
    form1.validateFields()
      .then((values) => {
        setFormData(values);
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleNoteChange = (e: any) => {
    setNoteText(e.target.value);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: any) => {
    setIsEditing(false);
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

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: isVi ? "Loại phòng" : "Room type",
      dataIndex: 'roomType',
      editable: true,
    },
    {
      title: isVi ? "Số phòng" : "Room number",
      dataIndex: 'roomNumber',
      editable: true,
    },
    {
      title: isVi ? "Số khách" : "Customer number",
      dataIndex: 'customerNumber',
      editable: true,
    },
    {
      title: isVi ? "Thành tiền" : "Amount",
      dataIndex: 'amount',
      editable: true,
      align: 'center',
      render: (text, record) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(text);
      }
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      roomType: 'Quân',
      roomNumber: '1',
      customerNumber: '1',
      amount: 1000000
    };
    setDataSource([newData, ...dataSource ]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData);
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const totalAmount = dataSource.reduce((acc, item) => {
    return acc + Number(item.amount);
  }, 0);
  const formattedTotalAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmount);

  return (
    <div className="App" style={{display: "flex", justifyContent: "space-between"}}>
      <div ref={reportTemplateRef} id="divToPrint" className='main' style={{display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", backgroundImage: `url(${template})`}}>
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
          <div className="content" style={{margin: "0 2em"}}>
            <Row>
              <Col span={12}>
                <div style={{"fontSize":"1.3em", fontWeight: "bold", "whiteSpace":"nowrap","color":"#3e78bc", padding: "1em 0 0.7em"}}>{isVi ? "Thông tin khách sạn" : "Name"}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold"}}>{isVi ? "Tên" : "Name"}: {formData.hotelNameV2 ? formData.hotelNameV2 : formData.hotelName}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold"}}>{isVi ? "Địa chỉ" : "Address"}: {formData.addressV2 ? formData.addressV2 : formData.address}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold"}}>{isVi ? "Hotline" : "Hotline"}: {formData.hotline}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold"}}>{isVi ? "Check in" : "Check in"}:  {formData.checkInOut[0] ? dayjs(formData.checkInOut[0]).format('DD/MM/YYYY HH:mm') : "" }</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold"}}>{isVi ? "Check out" : "Check out"}: {formData.checkInOut[1] ? dayjs(formData.checkInOut[1]).format('DD/MM/YYYY HH:mm') : ""}</div>
                <div style={{"marginLeft":"18px", paddingBottom: "1em", fontWeight: "bold", "fontSize":"12px","lineHeight":"12 px","color":"#f99d1c"}}>
                  (WIFI password: {formData.password})
                </div>
              </Col>
              <Col span={12}>
                <div style={{"fontSize":"1.3em", fontWeight: "bold", "whiteSpace":"nowrap","color":"#3e78bc", padding: "1em 0 0.7em"}}>{isVi ? "Thông tin khách hàng" : "Guest Info"}</div>
                <div style={{"fontSize":"1em", fontWeight: "bold", paddingBottom: "1em", "marginLeft":"18px"}}>{isVi ? "Tên" : "Name"}: {formData.customerName}</div>
                <div style={{"fontSize":"1em", fontWeight: "bold", paddingBottom: "1em","marginLeft":"18px"}}>{isVi ? "Số điện thoại" : "Phone"}: {formData.customerPhoneNumber}</div>
              </Col>
            </Row>
            <Row>
              <Table
                style={{width: "100%"}}
                components={components}
                pagination={false}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                summary={() => (
                  <>
                    <Table.Summary.Row style={{background: "#f5f5f5"}}>
                      <Table.Summary.Cell index={0} colSpan={3} align='center'>{isVi ? "Tổng cộng" : "Total"}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3} colSpan={1} align='center'>
                        {formattedTotalAmount}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row style={{background: "#f5f5f5"}}>
                      <Table.Summary.Cell index={0} colSpan={3} align='center'>{isVi ? "Ghi chú" : "Note"}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3} colSpan={1} align='center'>
                        {isEditing ? (
                          <Input
                            value={noteText}
                            onChange={handleNoteChange}
                            onBlur={handleBlur}
                            autoFocus
                            style={{ width: '100%', textAlign: 'center' }}
                          />
                        ) : (
                          <div
                            onClick={handleFocus}
                            style={{ width: '100%', textAlign: 'center', cursor: 'pointer', minHeight: '16px', minWidth: '100px' }}
                          >
                            {noteText}
                          </div>
                        )}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />
            </Row>
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

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "end", gap: "16px", height: "max-content", margin: "16px"}}>
        <Button onClick={() => setIsModalOpen(true)}>sửa</Button>
        <Button onClick={handleAdd} type="primary">
          Add a row
        </Button>
        {/* <Button onClick={() => handleDelete(count - 1)} type="primary" style={{ marginBottom: 16 }}>
          delete last row
        </Button> */}
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
        <Button onClick={exportPDF}>Xuất PDF</Button>
        <Button onClick={exportImage}>Xuất ảnh</Button>
      </div>
      
      <Modal maskClosable={false} width={"60%"} title="Nhập thông tin" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form
          name="basic"
          autoComplete="off"
          form={form1}
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
          <Row style={{marginBottom: "16px"}} gutter={16}>
            <Col span={14}>
              <Form.Item
                layout='vertical'
                label="Tên khách sạn"
                name="hotelName"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={hotelList.map(hotel => ({ label: `${hotel.name} - ${hotel.address}`, value: hotel.id }))}
                  onChange={(value) => {
                    const hotel = hotelList.find(hotel => hotel.id === value);
                    form1.setFieldsValue({ address: hotel?.address, hotelName: hotel?.name });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                layout='vertical'
                label="Tên khách sạn thay thế"
                name="hotelNameV2"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{marginBottom: "16px"}} gutter={16}>
            <Col span={14}>
              <Form.Item
                layout='vertical'
                label="Địa chỉ"
                name="address"
              >
                <Input disabled/>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                layout='vertical'
                label="Địa chỉ thay thế"
                name="addressV2"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
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
          {/* <Form.Item
            label="Loại phòng"
            name="roomType"
            rules={[{ required: true, message: 'Vui lòng nhập loại phòng!' }]}
          >
            <Select 
              options={roomTypeList.map(type => ({ label: type.value, value: type.value }))}
              onChange={(value) => {
                form1.setFieldsValue({ roomType: value });
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
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateSecond;