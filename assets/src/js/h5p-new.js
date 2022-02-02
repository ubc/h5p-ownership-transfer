import React, { Fragment, useEffect, useState, useRef } from 'react';

export default () => {
    const [newOwnerEmail, setNewOwnerEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [inputValue, setIputValue] = useState('');

    useEffect( () => {
        if( true === status ) {
            setIputValue( newOwnerEmail );
        } else {
            setIputValue( '' );
        }
    }, [status])

    const validateNewOwnerEmail = async () => {
        let formData = new FormData();

        const params = new URLSearchParams(window.location.search)

        formData.append( 'action', 'ubc_h5p_verify_new_owner' );
        formData.append( 'nonce', ubc_h5p_ownership_transfer_admin.security_nonce );
        formData.append( 'email', newOwnerEmail );

        if( params.has('id') ) {
            formData.append( 'content_id', params.get('id') );
        }
        

        let response = await fetch(ajaxurl, {
            method: 'POST',
            body: formData
        })
        response = await response.json();
        setStatus( response.valid );
        setErrorMessage( response.error_message ? response.error_message : '' );
    }

    const validateEmail = ( email ) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    return (
        <Fragment>
            <div role="button" className="h5p-toggle" tabIndex="0" aria-expanded="true" aria-label="Toggle panel"></div>
            <h2>Ownership Transfer</h2>
            <div className="h5p-panel">
            <input
                type="text"
                value={ newOwnerEmail }
                onChange={ e => {
                    setNewOwnerEmail( e.target.value );
                }}
            />
            <input
                name="h5p-content-new-author-email"
                hidden
                value={ inputValue }
            />
            <button
                onClick={ e => {
                    e.preventDefault();
                    if( ! validateEmail( newOwnerEmail ) ) {
                        alert( 'Email provided is not valid.' );
                        return;
                    }
                    validateNewOwnerEmail();
                } }
                className="button"
            >
                Validate
            </button>
            { null !== status ? <p className='howto'>Status: <span className={`${ status ? 'valid' : 'invalid' }`}>{ status ? 'Valid': 'Invalid' }</span></p> : null }
            { '' !== errorMessage ? <p className='howto'>Error Message: <span className='invalid'>{ errorMessage }</span></p> : null }
            <p className="howto">Please type in the email address associated with the user's account on current platform. Validate the email address by clicking the button above to make sure the ownership will be transfered successfully.</p>
            </div>
        </Fragment>
    );
};