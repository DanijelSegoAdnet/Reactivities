import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { ActivityFormValues } from '../../../app/models/activity';

export default observer(function ActivityForm() {

    const {activityStore} = useStore();
    const {createActivity, updateActivity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();
    const history = useHistory();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required!'),
        description: Yup.string().required('Description is required!'),
        category: Yup.string().required('Category is required!'),
        date: Yup.string().required('Date is required!').nullable(),
        city: Yup.string().required('City is required!'),
        venue: Yup.string().required('Venue is required!')
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity]);

    function handleFormSubmit(activity: ActivityFormValues) {
        console.log(activity, 'activity')
        if  (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik enableReinitialize validationSchema={validationSchema} initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='title' placeholder='title'/>
                    <MyTextArea rows={3} placeholder='Description' name='description'/>
                    <MySelectInput options={categoryOptions} placeholder='Category' name='category'/>
                    <MyDateInput 
                    placeholderText='Date' 
                    name='date'
                    showTimeSelect
                    timeCaption='time'
                    dateFormat='MMMM d, yyyy h:mm aa'
                    />
                    <Header content='Location Details' sub color='teal' />
                    <MyTextInput placeholder='City' name='city'/>
                    <MyTextInput placeholder='Venue' name='venue'/>
                    <Button 
                    disabled={isSubmitting || !dirty || !isValid}
                    loading={isSubmitting} 
                    floated='right' 
                    positive 
                    type='submit' 
                    content='Submit' 
                    />
                    <Button as={Link} to={'/activities'} floated='right' type='button' content='Cancel' />
                </Form>
                )}
            </Formik>
        </Segment>
    )
})