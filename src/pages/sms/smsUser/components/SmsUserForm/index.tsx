import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import {Form, Input, Modal, Radio, Select} from "antd";
import SmsUserDataType, {SmsUserQueryParams} from "@/pages/sms/smsUser/smsUser";
import FormLayout from "@/models/formLayout";
import RoleDataType from "@/pages/sms/role/Role";
import {Dispatch} from "redux";
import {SmsUserModelStateType} from "@/models/smsUser";
import LoadingDataType from "@/models/loading";


const FormItem = Form.Item;
const Option = Select.Option;

interface SmsUserFormProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<SmsUserDataType>;
  roleList: Array<RoleDataType>;
  smsUserModel?: SmsUserModelStateType;
  loading?: boolean;
  queryParams: SmsUserQueryParams;
  changeStateClose: () => void;
}

interface SmsUserFormState {

}

@connect(({smsUser, loading}: {smsUser: SmsUserModelStateType, loading: LoadingDataType})=> {
  return {
    smsUserModel: smsUser,
    loading: loading.models.smsUser
  }
})
class SmsUserForm extends React.Component<SmsUserFormProps, SmsUserFormState> {

  state: SmsUserFormState = {

  };

  handleSubmit = (): void => {
    const {dispatch, form, formType, queryParams} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: SmsUserDataType): void => {
      if (err) return;
      const item: SmsUserDataType = {
        ...fieldsValue
      };
      if (formType === 'edit') {
        dispatch({
          type: 'smsUser/editSmsUserFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'smsUser/fetchSmsUserPage',
              payload: queryParams,
            });
          }
        });
      } else {
        if (formType === 'create') {
          dispatch({
            type: 'smsUser/createSmsUserFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'smsUser/fetchSmsUserPage',
                payload: queryParams,
              });
            }
          });
        }
      }
      this.props.changeStateClose();

    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {visible, form, current = {}, roleList} = this.props;

    const {getFieldDecorator} = form;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    const renderForm = (): React.ReactNode => {

      if (!current) return;

      getFieldDecorator("id", {
        initialValue: current.id,
      });
      return (
        <Form>
          <FormItem label={"Role Group"} {...formLayout}>
            {
              getFieldDecorator("roleId", {
                initialValue: current.roleId,
                rules: [{required: true, message: "Please select the Role Group!"}]
              })(
                <Select placeholder={'Please select the Role Group'} >
                  {roleList.map((item: RoleDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"User Name"} {...formLayout}>
            {
              getFieldDecorator("name", {
                initialValue: current.name,
                rules: [{required: true, message: "Please input the User Name"}]
              })(
                <Input placeholder={'DB number'} />
              )
            }
          </FormItem>
          <FormItem label={"Gender"} {...formLayout}>
            {
              getFieldDecorator("gender", {
                initialValue: current.gender,
                rules: [{required: true, message: "Please Select gender"}]
              })(
                <Radio.Group >
                  <Radio value={0}>Male</Radio>
                  <Radio value={1}>Female</Radio>
                </Radio.Group>
              )
            }
          </FormItem>
          <FormItem label={"Telephone"} {...formLayout}>
            {
              getFieldDecorator("telephone", {
                initialValue: current.telephone,
                rules: [{required: true, message: "Please input the Telephone"}]
              })(
                <Input placeholder={'Telephone'} type={"text"}/>
              )
            }
          </FormItem>
          <FormItem label={"Email"} {...formLayout}>
            {
              getFieldDecorator("email", {
                initialValue: current.email,
              })(
                <Input placeholder={'Email'} type={"text"}/>
              )
            }
          </FormItem>
          <FormItem label={"Description"} {...formLayout}>
            {
              getFieldDecorator("description", {
                initialValue: current.description,
              })(
                <Input type={"text"} placeholder={'Description'}/>
              )
            }
          </FormItem>
        </Form>
      )
    };


    return (
      <Modal
        title={"Config role group Alarm list to send"}
        width={800}
        bodyStyle={{padding: '28px 0 0'}}
        destroyOnClose
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={() => {
          this.props.changeStateClose()
        }}
      >
        {renderForm()}
      </Modal>
    );
  }
}

export default Form.create<SmsUserFormProps>()(SmsUserForm);
