import React, { Fragment, useEffect, useState } from 'react';

export default () => {
    const [newOwnerEmail, setNewOwnerEmail] = useState('');
    const [valid, setValid] = useState(null);
    const [message, setMessage] = useState('');
    const [currentAuthorEmail, setCurrentAuthorEmail] = useState('');
    const [shouldButtonDisabled, setShouldButtonDisabled] = useState(false);

    useEffect(() => {
        getCurrentContentAuthorEmail();
    });

    const clearMessage = () => {
        setValid(null);
        setMessage('');
    }

    const transferOwnership = async () => {
        setShouldButtonDisabled( true );

        let formData = new FormData();

        const params = new URLSearchParams(window.location.search)

        formData.append( 'action', 'ubc_h5p_ownership_transfer' );
        formData.append( 'nonce', ubc_h5p_ownership_transfer_admin.security_nonce );
        formData.append( 'email', newOwnerEmail );

        if( ! params.has('id') ) {
            return;
        }

        formData.append( 'content_id', params.get('id') );

        let response = await fetch(ajaxurl, {
            method: 'POST',
            body: formData
        })
        response = await response.json();

        setValid( response.valid );
        setMessage( response.message ? response.message : '' );

        await getCurrentContentAuthorEmail();

        setShouldButtonDisabled( false );
    }

    const getCurrentContentAuthorEmail = async () => {
        let formData = new FormData();
        const params = new URLSearchParams(window.location.search)

        if( ! params.has('id') ) {
            return;
        }

        formData.append( 'action', 'ubc_h5p_get_content_author_email' );
        formData.append( 'content_id', params.get('id') );
        formData.append( 'nonce', ubc_h5p_ownership_transfer_admin.security_nonce );
        
        let response = await fetch(ajaxurl, {
            method: 'POST',
            body: formData
        })
        response = await response.json();

        if( response.success ) {
            setCurrentAuthorEmail( response.data );
        }
    }

    return (
        <Fragment>
            <div role="button" className="h5p-toggle" tabIndex="0" aria-expanded="true" aria-label="Toggle panel"></div>
            <h2>{ ubc_h5p_ownership_transfer_translations.metabox_title }</h2>
            <div className="h5p-panel">
            <form
                onSubmit={ e => {
                    e.preventDefault();
                    transferOwnership();
                } }
            >
            <input
                type="email"
                value={ newOwnerEmail }
                onChange={ e => {
                    setNewOwnerEmail( e.target.value );
                }}
                required
            />
            <button
                type="submit"
                className="button"
                disabled={ shouldButtonDisabled }
                onClick={(e) => {
                    clearMessage();
                }}
            >
                { ubc_h5p_ownership_transfer_translations.transfer_button_label }
            </button>
            </form>
            { '' !== message ? <div className={`${ valid ? 'valid' : 'invalid' } h5p-notice`}> 
                <p><strong>{ message }</strong></p>
            </div> : null }
            <p className="howto">{ ubc_h5p_ownership_transfer_translations.transfer_helper_message }</p>
            <p className="howto h5p-current-author">{ ubc_h5p_ownership_transfer_translations.current_author_label }:<br />{ currentAuthorEmail }</p>
            </div>
        </Fragment>
    );
};