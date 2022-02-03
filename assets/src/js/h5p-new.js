import React, { Fragment, useEffect, useState } from 'react';

export default () => {
    const [newOwnerEmail, setNewOwnerEmail] = useState('');
    const [valid, setValid] = useState(null);
    const [message, setMessage] = useState('');
    const [currentAuthorEmail, setCurrentAuthorEmail] = useState('');

    useEffect(() => {
        getCurrentContentAuthorEmail();
    });

    const clearMessage = () => {
        setValid(null);
        setMessage('');
    }

    const transferOwnership = async () => {
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

        getCurrentContentAuthorEmail();
    }

    const getCurrentContentAuthorEmail = async() => {
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
            <h2>Content Author Transfer</h2>
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
                onClick={(e) => {
                    clearMessage();
                }}
            >
                Transfer
            </button>
            </form>
            { '' !== message ? <div className={`${ valid ? 'valid' : 'invalid' } h5p-notice`}> 
                <p><strong>{ message }</strong></p>
            </div> : null }
            <p className="howto">Enter the email address associated with a user on this platform. Pressing 'Transfer' will make that person the author of this piece of H5P content.</p>
            <p className="howto h5p-current-author">Current Author:<br />{ currentAuthorEmail }</p>
            </div>
        </Fragment>
    );
};