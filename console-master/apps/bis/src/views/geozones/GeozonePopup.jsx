import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { GeozoneListDeleteMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { BasicClose, BasicDelete, BasicEdit } from '@ues/assets'

import { CONFIRM_DELETE_GEOZONE_POPUP } from '../../config/consts/dialogIds'
import MapContext from '../../googleMaps/Context'
import { default as Popup } from '../../googleMaps/Popup'
import { Icon, IconButton, reportClientError, RiskLevel } from '../../shared'
import EditGeozone from './EditGeozone'
import { DeletionConfirmation } from './GeozoneModals'
import styles from './GeozonePopup.module.less'
import Colors from './shapes/Colors'

const GeozonePopup = memo(
  ({
    latlng,
    invertedLatlng,
    zone: { id, geometry, risk, name, location, unit },
    onClose,
    onEditModeChanged,
    disableZoneSelection,
    onDeletionCompleted,
  }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const { google, map } = useContext(MapContext)
    const [editMode, setEditMode] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({})
    const openDeleteDialog = useCallback(() => setDeleteDialog({ dialogId: CONFIRM_DELETE_GEOZONE_POPUP }), [])
    const closeDeleteDialog = useCallback(() => setDeleteDialog({}), [])

    const area = useMemo(() => {
      if (!google) {
        return null
      }
      let squareMetres = null
      switch (geometry.type) {
        case 'Circle':
          squareMetres = Math.PI * geometry.radius * geometry.radius
          break
        case 'Polygon':
          squareMetres = google.maps.geometry.spherical.computeArea(
            geometry.coordinates.map(coord => ({ lat: () => coord[0], lng: () => coord[1] })),
          )
          break
      }

      if (!squareMetres) {
        return null
      } else if (squareMetres < 1000) {
        // Less than 0.1 hectare, use square metres
        return { unit: 'm²', value: squareMetres.toPrecision(4) }
      } else if (squareMetres < 10000000) {
        // Less than 1000 hectares, use hectares
        return { unit: 'ha', value: (squareMetres / 10000).toPrecision(4) }
      } else if (squareMetres) {
        // Otherwise use square kilometres
        const km = squareMetres / 1000000
        let value = km.toPrecision(4)
        if (km >= 1000000000) {
          value = `${(km / 1000000000).toPrecision(3)}G`
        } else if (km >= 1000000) {
          value = `${(km / 1000000).toPrecision(3)}M`
        } else if (km >= 1000) {
          value = `${(km / 1000).toPrecision(3)}K`
        }
        return { unit: 'km²', value }
      }
      return null
    }, [google, geometry])

    const editShape = useRef(null)
    const [editPosition, setEditPosition] = useState(null)
    const onEdit = useCallback(() => {
      disableZoneSelection(true)
      setEditMode(true)
      onEditModeChanged(true)
      setEditPosition([
        {
          lat: () => latlng.lat(),
          lng: () => latlng.lng(),
        },
        {
          lat: () => invertedLatlng.lat(),
          lng: () => invertedLatlng.lng(),
        },
      ])
      if (geometry.type === 'Circle') {
        const circleOptions = {
          center: {
            lat: geometry.center.lat,
            lng: geometry.center.lon,
          },
          radius: geometry.radius,
          ...Colors.style(risk, theme),
        }
        editShape.current = new google.maps.Circle(circleOptions)
        editShape.current.google = google
      } else if (geometry.type === 'Polygon') {
        const polygonOptions = {
          paths: geometry.coordinates.map(coord => ({
            lat: coord[0],
            lng: coord[1],
          })),
          ...Colors.style(risk, theme),
        }
        editShape.current = new google.maps.Polygon(polygonOptions)
        editShape.current.google = google
      }
      editShape.current.setMap(map)
    }, [disableZoneSelection, onEditModeChanged, geometry, map, latlng, invertedLatlng, risk, google, theme])

    const onEditDone = useCallback(() => {
      if (editShape.current) {
        editShape.current.setMap(null)
        editShape.current = null
      }
      setEditMode(false)
      onEditModeChanged(false)
      disableZoneSelection(false)
    }, [disableZoneSelection, onEditModeChanged])

    const deleteMutationOptions = useMemo(
      () => ({
        onCompleted: onDeletionCompleted,
      }),
      [onDeletionCompleted],
    )
    const [deleteGeozones, { loading: loadingDeleteGeozones }] = useStatefulApolloMutation(
      GeozoneListDeleteMutation,
      deleteMutationOptions,
    )

    const onDelete = useCallback(async () => {
      try {
        await deleteGeozones({
          variables: {
            ids: [id],
          },
        })
      } catch (e) {
        reportClientError(e)
      }
      closeDeleteDialog()
    }, [closeDeleteDialog, deleteGeozones, id])

    const renderDelete = useMemo(
      () => (
        <span>
          <IconButton title={t('common.delete')} className={styles.button} onClick={openDeleteDialog}>
            <Icon icon={BasicDelete} />
          </IconButton>
          <DeletionConfirmation
            dialogId={deleteDialog.dialogId}
            zone={[name]}
            onClose={closeDeleteDialog}
            onDelete={onDelete}
            deleteInProgress={loadingDeleteGeozones}
          />
        </span>
      ),
      [t, openDeleteDialog, deleteDialog.dialogId, name, closeDeleteDialog, onDelete, loadingDeleteGeozones],
    )

    if (editMode) {
      const props = {
        id,
        showRadius: geometry.type === 'Circle',
        setPosition: setEditPosition,
        position: editPosition[0],
        invertedPosition: editPosition[1],
        onDone: onEditDone,
        shape: editShape.current,
        initialName: name,
        initialLevel: risk,
        initialUnit: unit,
      }
      return (
        <Popup position={props.position} invertedPosition={props.invertedPosition} onClose={onEditDone} stayOpen>
          <EditGeozone {...props} />
        </Popup>
      )
    }

    return (
      <Popup position={latlng} invertedPosition={invertedLatlng} risk={risk} onClose={onClose}>
        <div className={styles.topBox} risk={risk}>
          <div className={styles.title}>{name}</div>
          <div className={styles.description}>{t(`risk.level.${risk}`)} risk level geozone</div>
          <IconButton size="small" title={t('common.close')} className={styles.closeButton} onClick={onClose} color="inherit">
            <Icon icon={BasicClose} />
          </IconButton>
        </div>
        <div className={styles.bottomBox}>
          <div className={styles.body}>{location}</div>
          <div className={styles.footer}>
            {area ? (
              <span>
                {area.value} {area.unit}
              </span>
            ) : null}
            <span>
              <IconButton title={t('common.edit')} className={styles.button} onClick={onEdit}>
                <Icon icon={BasicEdit} />
              </IconButton>
              {renderDelete}
            </span>
          </div>
        </div>
      </Popup>
    )
  },
)

GeozonePopup.displayName = 'GeozonePopup'
GeozonePopup.propTypes = {
  latlng: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }).isRequired,
  invertedLatlng: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }),
  zone: PropTypes.shape({
    id: PropTypes.string.isRequired,
    risk: PropTypes.oneOf([RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW]).isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    geometry: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    unit: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEditModeChanged: PropTypes.func.isRequired,
  disableZoneSelection: PropTypes.func,
}

GeozonePopup.defaultProps = {
  disableZoneSelection: () => {},
}

export default GeozonePopup
